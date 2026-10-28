// Code relief (DA scene 4): the code-lines pattern in relief. Rows of tokens as low blocks seen from an
// isometric camera; the row under the pointer rises and brightens like a selected line; left alone, a cursor
// steps down the rows on screen. A few blocks are accent-red edits. One InstancedMesh (one draw call).
// Paused off-screen and in hidden tabs, one static frame under reduced motion. No GPU → throws (host keeps
// its ground).
import {
  AmbientLight, BoxGeometry, Color, DirectionalLight, InstancedMesh, MeshStandardMaterial, Object3D,
  OrthographicCamera, Plane, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
} from 'three';

export type ReliefOptions = { pointer?: HTMLElement };

const ROWS = 36, D = 4.6, W = 170, PX = 0.16; // rows, row pitch, field width (world), world units per CSS px

export async function relief(host: HTMLElement, { pointer = host }: ReliefOptions = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
  camera.position.set(90, 110, 90);
  camera.lookAt(0, 0, 0);
  scene.add(new AmbientLight(0xffffff, 0.3));
  const sun = new DirectionalLight(0xffffff, 1);
  sun.position.set(60, 80, 100);
  scene.add(sun);

  // Tokens: seeded so every visit draws the same "file".
  let seed = 5;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tokens: { x: number; z: number; w: number; row: number; edit: boolean }[] = [];
  for (let row = 0; row < ROWS; row++) {
    let x = -W / 2 + Math.floor(rnd() * 4) * 4;
    for (;;) {
      const w = 3 + Math.floor(rnd() * 6) * 2.5;
      if (x + w > W / 2) break;
      tokens.push({ x: x + w / 2, z: (row - ROWS / 2) * D, w, row, edit: rnd() > 0.92 });
      x += w + 2;
    }
  }
  const mesh = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ roughness: 0.75 }), tokens.length);
  scene.add(mesh);
  const heights = new Float32Array(tokens.length).fill(1);
  const dummy = new Object3D();
  const style = getComputedStyle(host);
  const tone = { muted: new Color(), text: new Color(), accent: new Color() };
  const readTones = () => {
    tone.muted.setStyle(style.getPropertyValue('--muted').trim() || '#888');
    tone.text.setStyle(style.getPropertyValue('--text').trim() || '#fff');
    tone.accent.setStyle(style.getPropertyValue('--accent').trim() || '#f55');
  };
  readTones();

  let sel = -1;
  let shown: number[] = []; // rows whose centre is on screen (the idle cursor stays on them)
  const draw = (snap = false) => {
    let moving = false;
    tokens.forEach((t, i) => {
      const on = t.row === sel;
      const h = on ? 4.5 : 1;
      heights[i] = snap ? h : heights[i] + (h - heights[i]) * 0.15;
      if (Math.abs(h - heights[i]) > 0.01) moving = true;
      dummy.position.set(t.x, heights[i] / 2, t.z);
      dummy.scale.set(t.w, heights[i], 2.6);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, t.edit ? tone.accent : on ? tone.text : tone.muted);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return moving;
  };

  const v = new Vector3();
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    // Same world scale at every size: a taller frame shows more rows, not bigger blocks.
    Object.assign(camera, { left: (-w / 2) * PX, right: (w / 2) * PX, top: (h / 2) * PX, bottom: (-h / 2) * PX });
    camera.updateProjectionMatrix();
    shown = [];
    for (let row = 0; row < ROWS; row++) {
      v.set(0, 0, (row - ROWS / 2) * D).project(camera);
      if (Math.abs(v.x) < 0.85 && Math.abs(v.y) < 0.85) shown.push(row);
    }
  };
  resize();
  sel = shown[Math.floor(shown.length / 2)] ?? 0;
  draw(true);
  await renderer.compileAsync(scene, camera);
  host.appendChild(renderer.domElement);
  renderer.render(scene, camera);
  void getComputedStyle(renderer.domElement).opacity; // start the fade from 0
  host.classList.add('is-ready');

  const ro = new ResizeObserver(() => { resize(); draw(true); renderer.render(scene, camera); });
  ro.observe(host);
  if (reduce) return;

  const ray = new Raycaster(), floor = new Plane(new Vector3(0, 1, 0), 0), hit = new Vector3(), ndc = new Vector2();
  let inside = false;
  pointer.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(floor, hit)) { sel = Math.round(hit.z / D + ROWS / 2); inside = true; }
  }, { passive: true });
  pointer.addEventListener('pointerleave', () => { inside = false; });

  let visible = true, step = 0, frames = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(host);
  renderer.setAnimationLoop((t) => {
    if (!visible || document.hidden) return;
    if (++frames % 60 === 0) readTones(); // theme switches
    if (!inside && t - step > 900 && shown.length) { step = t; sel = shown[(shown.indexOf(sel) + 1) % shown.length]; }
    draw();
    renderer.render(scene, camera);
  });
}
