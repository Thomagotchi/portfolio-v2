// Dot terrain (DA scene 2): a plane of square points rolling like a slow signal, seen from 45° above.
// Points near the pointer lift and a few glow in the accent. Heights and colours run in the vertex shader
// (the board's version updated every point on the CPU each frame).
// Paused off-screen and in hidden tabs, one static frame under reduced motion, disposed on unmount.
// No GPU (software WebGL) → throws, and the host keeps its plain ground.
import { BufferAttribute, BufferGeometry, Color, PerspectiveCamera, Plane, Points, Raycaster, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from 'three';

export type TerrainOptions = {
  /** [cols, rows] per breakpoint: mobile, md, lg. */
  density: [number, number][];
  /** Element that receives pointer moves (defaults to the host). */
  pointer?: HTMLElement;
};

const vertex = /* glsl */ `
  uniform float uTime, uIn, uSize, uXH, uZH;
  uniform vec2 uHit;
  uniform vec3 uBg, uMuted, uAccent;
  attribute float aSel;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    float k = uIn * max(0.0, 1.0 - distance(p.xz, uHit) / 16.0);
    p.y = sin(p.x / 10.0 + uTime / 1600.0) * 2.2 + sin(p.z / 8.0 - uTime / 2300.0) * 1.6 + k * k * 5.0;
    float fade = clamp((p.z + uZH * 0.8) / (uZH * 1.1), 0.0, 1.0) * clamp((uXH - abs(p.x)) / 40.0, 0.0, 1.0);
    vColor = mix(uBg, (k > 0.3 && aSel > 0.5) ? uAccent : uMuted, fade);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;
const fragment = /* glsl */ `
  varying vec3 vColor;
  void main() { gl_FragColor = vec4(vColor, 1.0); }`;

const pick = <T>(list: T[]) => list[matchMedia('(width >= 1024px)').matches ? 2 : matchMedia('(width >= 768px)').matches ? 1 : 0] ?? list[0];

export async function terrain(host: HTMLElement, { density, pointer = host }: TerrainOptions) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 2000);
  camera.position.set(0, 60, 60);
  camera.lookAt(0, 0, 0);

  // Same field size at every density: fewer points are spaced wider.
  const [NX, NZ] = pick(density);
  const sx = (1.6 * 180) / NX;
  const sz = (1.6 * 96) / NZ;
  const n = NX * NZ;
  const pos = new Float32Array(n * 3);
  const sel = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = ((i % NX) - NX / 2) * sx;
    pos[i * 3 + 2] = (Math.floor(i / NX) - NZ / 2) * sz;
    sel[i] = i % 7 === 0 ? 1 : 0;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(pos, 3));
  geometry.setAttribute('aSel', new BufferAttribute(sel, 1));

  const css = getComputedStyle(host);
  const col = (name: string) => new Color(css.getPropertyValue(name).trim() || '#fff');
  const uniforms = {
    uTime: { value: 0 }, uIn: { value: 0 }, uHit: { value: new Vector2() }, uSize: { value: 1 },
    uXH: { value: 180 * 0.8 }, uZH: { value: 96 },
    uBg: { value: col('--bg') }, uMuted: { value: col('--muted') }, uAccent: { value: col('--accent') },
  };
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, depthWrite: false });
  scene.add(new Points(geometry, material));

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // As PointsMaterial (size 0.5, attenuated): size * drawing-buffer height / 2.
    uniforms.uSize.value = 0.5 * renderer.getPixelRatio() * h * 0.5;
  };
  resize();
  await renderer.compileAsync(scene, camera);
  host.appendChild(renderer.domElement);
  renderer.render(scene, camera);
  // Flush styles so the canvas starts at opacity 0: otherwise the fade (and its delay) is skipped.
  void getComputedStyle(renderer.domElement).opacity;
  host.classList.add('is-ready');
  if (reduce) {
    // Reduced motion: one still frame, redrawn when the frame resizes (a cleared canvas would stay blank).
    const ro = new ResizeObserver(() => { resize(); renderer.render(scene, camera); });
    ro.observe(host);
    return () => { ro.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }

  // Pointer → ray onto the ground plane, eased.
  const ray = new Raycaster();
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const hit = new Vector3();
  const ndc = new Vector2();
  let inside = false;
  const target = new Vector2();
  const onMove = (e: PointerEvent) => {
    const b = host.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) target.set(hit.x, hit.z);
    inside = true;
  };
  const onLeave = () => { inside = false; };
  pointer.addEventListener('pointermove', onMove, { passive: true });
  pointer.addEventListener('pointerleave', onLeave);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  renderer.setAnimationLoop((t) => {
    if (!visible || document.hidden) return;
    uniforms.uTime.value = t;
    uniforms.uHit.value.lerp(target, 0.1);
    uniforms.uIn.value += ((inside ? 1 : 0) - uniforms.uIn.value) * 0.08;
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    pointer.removeEventListener('pointermove', onMove);
    pointer.removeEventListener('pointerleave', onLeave);
    io.disconnect();
    ro.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
