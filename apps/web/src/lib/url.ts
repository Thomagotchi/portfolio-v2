/** '/about.html' | '/index.html' | '/about/' → '/about' | '/' */
export const cleanPath = (pathname: string) => pathname.replace(/(index)?\.html$/, '').replace(/\/$/, '') || '/';
