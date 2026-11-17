import * as React from 'react';
import { ProjectCase } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

export interface PortfolioWarpCarouselHandle {
  next: () => void;
  prev: () => void;
  impulseWheel: (delta: number) => void;
}

export interface PortfolioWarpCarouselProps {
  projects: ProjectCase[];
  onOpenProject: (project: ProjectCase) => void;
  onActiveChange?: (project: ProjectCase, index: number) => void;
  autoplay?: boolean;
  background?: string;
  warp?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_FONT =
  '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

/* ------------------------------------------------------------------ */
/* Geometry: Widescreen 3+2 curved gallery carousel (3 full + 2 edge) */
/* ------------------------------------------------------------------ */

const CW = 256;
const CH = 320;
const CR = 12;
const FOCAL = 734.103;
const SLOTS = 6; // render up to 6 closest cards so q in [-2.6, +2.6] is seamless
const G = {
  qA: 0.46401,
  XLA: 165.774,
  zA: 35.354,
  psiA: 1.44638,
  a1: 1.31454,
  a2: 1.10948,
  qB: 0.74999,
  XB: 204.525,
  ZB: 355.405,
  bB: 0.69311,
  bE: 0.04614,
  vC: 203.134,
  aC: 229.260,
  kB: 0.01087,
  bP: 0.99129,
  qPR: 1.01828,
  bPL: 1.00920,
  qPL: 1.07139,
};

type Pose = [number, number, number];

/** Full 3D hinge-flip pose from WarpCarousel + linear C1 wing continuation for q in [1, 2.6] */
function poseAt(q0: number): Pose {
  let q = q0;
  if (Math.abs(q) < 1) q -= G.kB * Math.sin(Math.PI * q) ** 2;
  const s = q < 0 ? -1 : 1;
  const a = Math.abs(q);
  const half = CW / 2;
  if (a <= G.qA) {
    const t = a / G.qA;
    const xl = -half + (G.XLA + half) * Math.pow(t, G.a1);
    const zl = G.zA * t ** 4;
    const psi = G.psiA * Math.pow(t, G.a2);
    return [s * (xl + half * Math.cos(psi)), zl + half * Math.sin(psi), s * psi];
  }
  const dXL = ((G.XLA + half) * G.a1) / G.qA;
  const dZL = (G.zA * 4) / G.qA;
  const dps = (G.psiA * G.a2) / G.qA;
  let Hx: number;
  let Hz: number;
  if (a <= G.qB) {
    const L = G.qB - G.qA;
    const t = (a - G.qA) / L;
    const hx = G.XLA + CW * Math.cos(G.psiA);
    const hz = G.zA + CW * Math.sin(G.psiA);
    const dhx = dXL - CW * Math.sin(G.psiA) * dps;
    const dhz = dZL + CW * Math.cos(G.psiA) * dps;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
    const h10 = t ** 3 - 2 * t ** 2 + t;
    const h01 = -2 * t ** 3 + 3 * t ** 2;
    const h11 = t ** 3 - t ** 2;
    Hx = h00 * hx + h10 * L * dhx * G.bB + h01 * G.XB + h11 * L * G.vC * G.bE;
    Hz = h00 * hz + h10 * L * dhz * G.bB + h01 * G.ZB;
  } else if (a <= 1.0) {
    const d = a - G.qB;
    Hx = G.XB + G.vC * d + G.aC * d * d;
    Hz = G.ZB;
  } else {
    // At a=1, Hx=269.62 (u_inner=181.6, u_outer=354.1).
    // Continue smoothly at C1 slope ~317.8 so q=+-2 sits around u=[396..568] in the outer lens wings!
    const d1 = 1.0 - G.qB;
    const Hx1 = G.XB + G.vC * d1 + G.aC * d1 * d1;
    const v1 = G.vC + 2 * G.aC * d1;
    Hx = Hx1 + v1 * (a - 1.0);
    Hz = G.ZB;
  }
  const qP = s < 0 ? G.qPL : G.qPR;
  const bP = s < 0 ? G.bPL : G.bP;
  const LP = qP - G.qA;
  const tp = Math.min(1, (a - G.qA) / LP);
  const psi =
    (2 * tp ** 3 - 3 * tp ** 2 + 1) * G.psiA +
    (tp ** 3 - 2 * tp ** 2 + tp) * LP * dps * bP +
    (-2 * tp ** 3 + 3 * tp ** 2) * Math.PI;
  return [s * (Hx - half * Math.cos(psi)), Hz - half * Math.sin(psi), s * psi];
}

function parseColor(
  c: string,
  fallback: [number, number, number] = [239, 239, 233]
): [number, number, number] {
  const s = (c || '').trim();
  const m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (m) {
    let h = m[1];
    if (h.length <= 4)
      h = h
        .split('')
        .map((x) => x + x)
        .join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return fallback;
}

/* ------------------------------------------------------------------ */
/* Portfolio Project Card Texture Painter                             */
/* ------------------------------------------------------------------ */

function paintProjectCard(
  cv: HTMLCanvasElement,
  project: ProjectCase,
  img: HTMLImageElement | null,
  family: string
) {
  const w = cv.width;
  const h = cv.height;
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  const k = w / CW;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.setTransform(k, 0, 0, k, 0, 0);

  const frameBg = '#FFFFFF';
  const ink = '#0B0B0B';
  ctx.fillStyle = frameBg;
  ctx.fillRect(0, 0, CW, CH);

  const footerH = 26;
  const isContain = project.coverFit === 'contain';
  const padX = isContain ? 15 : 8;
  const padTop = isContain ? 15 : 8;
  const artW = CW - padX * 2;
  const artH = CH - footerH - padTop - 4;

  ctx.fillStyle = isContain ? '#FFFFFF' : project.coverBg || '#14151A';
  ctx.fillRect(padX, padTop, artW, artH);

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    if (isContain) {
      const ratio = Math.min(artW / img.naturalWidth, artH / img.naturalHeight);
      const dw = img.naturalWidth * ratio;
      const dh = img.naturalHeight * ratio;
      const dx = padX + (artW - dw) / 2;
      const dy = padTop + (artH - dh) / 2;

      if (project.coverElevation) {
        ctx.shadowColor = 'rgba(11, 11, 11, 0.16)';
        ctx.shadowBlur = 12 * k;
        ctx.shadowOffsetY = 5 * k;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.beginPath();
      ctx.rect(padX, padTop, artW, artH);
      ctx.clip();
      const ratio = Math.max(artW / img.naturalWidth, artH / img.naturalHeight);
      const dw = img.naturalWidth * ratio;
      const dh = img.naturalHeight * ratio;
      const dx = padX + (artW - dw) / 2;
      const dy = padTop + (artH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }
    ctx.restore();
  } else {
    ctx.fillStyle = project.theme.bg;
    ctx.fillRect(padX, padTop, artW, artH);
  }

  ctx.strokeStyle = 'rgba(11, 11, 11, 0.08)';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(padX + 0.5, padTop + 0.5, artW - 1, artH - 1);

  ctx.fillStyle = frameBg;
  ctx.fillRect(0, CH - footerH, CW, footerH);

  ctx.fillStyle = ink;
  ctx.font = `600 7.5px ${family}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(project.slotCode, 10, CH - footerH / 2 + 0.5);

  const shortYear = (project.year || '2026').split('·')[0].trim();
  ctx.fillStyle = 'rgba(11, 11, 11, 0.45)';
  ctx.font = `500 7px ${family}`;
  ctx.textAlign = 'right';
  ctx.fillText(shortYear, CW - 10, CH - footerH / 2 + 0.5);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(11, 11, 11, 0.14)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, CW - 1, CH - 1);
}

/* ------------------------------------------------------------------ */
/* Glow envelope & WebGL2 shaders                                     */
/* ------------------------------------------------------------------ */

function glowShape(pose: Pose): [number, number, number] {
  const [px, pz, ps] = pose;
  const c = Math.cos(ps);
  if (c <= 0.15) return [0, 1, 0];
  const mu = (px * FOCAL) / Math.max(120, FOCAL + pz);
  const near = Math.min(1, FOCAL / (FOCAL + pz));
  return [mu, 115 * near, c * near * near];
}

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex;
uniform vec2 uRes;
uniform float uUnit;
uniform vec4 uPose[${SLOTS * 2}];
uniform vec3 uGlowShape[${SLOTS * 2}];
uniform vec3 uBg;
uniform float uWarp;
uniform float uMix;
uniform float uPhase;
out vec4 outColor;

const float F = ${FOCAL.toFixed(2)};
const float CW = ${CW.toFixed(1)};
const float CH = ${CH.toFixed(1)};
const float CR = ${CR.toFixed(1)};
const float EDGE_START = 315.0;

float lensH(float a){
  if (a <= EDGE_START) return a;
  float t = clamp((a - EDGE_START) / 245.0, 0.0, 1.0);
  float bend = mix(1.0, 0.56 - 0.32 * t, uWarp);
  return EDGE_START + (a - EDGE_START) * bend;
}
float lensS(float a){
  float t = clamp((a - EDGE_START) / 245.0, 0.0, 1.4);
  return 1.0 + uWarp * (0.22 * pow(t, 1.4));
}

float sdRound(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec4 shadeCard(vec4 pose, vec2 ps, float fx, float fy, out float depth){
  depth = 1e9;
  if (pose.w < 0.0) return vec4(0.0);
  float k = ps.x / F;
  float c = cos(pose.z), sn = sin(pose.z);
  float den = sn * k - c;
  if (abs(den) < 1e-5) return vec4(0.0);
  float A = pose.x, B = F + pose.y;
  float s = (A - B * k) / den;
  float t = B + s * sn;
  if (t < 4.0) return vec4(0.0);
  float y = t * ps.y / F;
  float dsdk = (B * c - A * sn) / (den * den);
  float fs = min(abs(dsdk / F) * fx, 48.0);
  float fyc = min(t / F * fy, 48.0);
  vec2 p = vec2(s, y);
  float d = sdRound(p, vec2(CW, CH) * 0.5, CR);
  vec2 q = abs(p) - vec2(CW, CH) * 0.5 + CR;
  vec2 n = q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  if (q.x > 0.0 && q.y > 0.0) n = normalize(q);
  float fp = length(vec2(fs * n.x, fyc * n.y)) + 1e-4;
  if (d > fp) return vec4(0.0);
  float cov = clamp(0.5 - d / fp, 0.0, 1.0);
  if (cov <= 0.0) return vec4(0.0);
  float uvx = c >= 0.0 ? (s / CW + 0.5) : (0.5 - s / CW);
  vec2 uv = vec2(uvx, 0.5 - y / CH);
  vec4 tex = textureGrad(uTex, vec3(uv, pose.w), vec2(fs / CW, 0.0), vec2(0.0, fyc / CH));
  float depthFade = clamp(smoothstep(140.0, 390.0, pose.y) * 0.14, 0.0, 0.14);
  vec3 shaded = mix(tex.rgb, uBg, depthFade);
  depth = t;
  return vec4(shaded, 1.0) * cov;
}

vec4 scene(vec2 ps, float fx, float fy, int base){
  vec4 col[${SLOTS}];
  float dep[${SLOTS}];
  for (int i = 0; i < ${SLOTS}; i++) col[i] = shadeCard(uPose[base + i], ps, fx, fy, dep[i]);
  for (int i = 0; i < ${SLOTS - 1}; i++)
    for (int j = 0; j < ${SLOTS - 1}; j++)
      if (j < ${SLOTS - 1} - i && dep[j] > dep[j+1]) {
        float td = dep[j]; dep[j] = dep[j+1]; dep[j+1] = td;
        vec4 tc = col[j]; col[j] = col[j+1]; col[j+1] = tc;
      }
  vec4 acc = vec4(0.0);
  for (int i = 0; i < ${SLOTS}; i++) acc += (1.0 - acc.a) * col[i];
  return acc;
}

vec3 stage(vec2 pu, float halfH, int base){
  float gH = min(halfH, 182.0);
  float dy = abs(pu.y + (gH - 12.0));
  if (dy > 34.0) return uBg;
  float sumW = 0.0;
  for (int i = 0; i < ${SLOTS}; i++){
    vec3 sh = uGlowShape[base + i];
    if (sh.z <= 0.0) continue;
    float E = exp(-pow(abs(pu.x - sh.x) / max(10.0, sh.y), 2.2));
    if (E < 0.005) continue;
    float v = exp(-pow(dy / 14.0, 2.0));
    sumW += sh.z * E * v;
  }
  float shadow = clamp(sumW * 0.065, 0.0, 0.075);
  return mix(uBg, vec3(0.043), shadow);
}

vec3 render(vec2 pu, float halfH, int base){
  float rawAu = abs(pu.x);
  float wingMask = 1.0 - smoothstep(545.0, 625.0, rawAu);
  if (wingMask <= 0.001) return uBg;

  float au = min(rawAu, 605.0);
  float px = 1.0 / uUnit;
  vec3 bg = stage(pu, halfH, base);

  // Inner center zone stays razor sharp with zero distortion
  if (au < EDGE_START || uWarp <= 0.0) {
    vec4 c = scene(pu, px, px, base);
    vec3 res = c.rgb + (1.0 - c.a) * bg;
    return mix(uBg, res, wingMask);
  }

  // Outer side wings: optical lens warp + RGB chromatic dispersion + holographic prism sheen
  float tZone = smoothstep(EDGE_START, 545.0, au);
  float e = 0.042 * uWarp * tZone;
  float S0 = lensS(au);
  float sg = pu.x < 0.0 ? -1.0 : 1.0;
  float blur = 1.0 + 3.6 * pow(tZone, 1.35) * uWarp;
  float fyb = 1.0 + 2.2 * tZone * uWarp;
  vec3 acc;
  float cardCov = 0.0;
  for (int ch = 0; ch < 3; ch++){
    float off = uWarp * (ch == 0 ? -15.5 : (ch == 1 ? 0.0 : 13.0));
    float h = lensH(au) + off * tZone;
    float h0 = lensH(au - 0.5) + off * smoothstep(EDGE_START, 545.0, au - 0.5);
    float h1 = lensH(au + 0.5) + off * smoothstep(EDGE_START, 545.0, au + 0.5);
    float fx = px * max(abs(h1 - h0), 0.05) * blur;
    float S = S0 * (ch == 0 ? 1.0 + e : (ch == 1 ? 1.0 : 1.0 - e));
    vec4 c = scene(vec2(sg * h, pu.y / S), fx, px / S * fyb, base);
    cardCov = max(cardCov, c.a);
    acc[ch] = (c.rgb + (1.0 - c.a) * bg)[ch];
  }

  // Lightweight holographic iridescent prism sheen across the side cards
  float diag = pu.x * 0.0046 + pu.y * 0.0032 + uPhase * 0.22;
  vec3 holo = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + diag));
  float edgeHolo = smoothstep(0.05, 0.85, tZone) * cardCov;
  float sheenLine = pow(0.5 + 0.5 * sin(diag * 7.5), 4.0);
  acc = mix(acc, acc * 0.84 + holo * (0.28 + 0.18 * sheenLine), edgeHolo * 0.58 * uWarp);

  return mix(uBg, acc, wingMask);
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 pu = (fc - 0.5 * uRes) / uUnit;
  float halfH = 0.5 * uRes.y / uUnit;
  vec3 col = render(pu, halfH, 0);
  if (uMix > 0.0) col = mix(col, render(pu, halfH, ${SLOTS}), uMix);
  outColor = vec4(col, 1.0);
}`;

interface GLState {
  gl: WebGL2RenderingContext;
  prog: WebGLProgram;
  tex: WebGLTexture;
  buf: WebGLBuffer | null;
  loc: Record<string, WebGLUniformLocation | null>;
}

function createGL(canvas: HTMLCanvasElement): GLState | null {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'aPos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog));
    return null;
  }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture()!;
  const loc: Record<string, WebGLUniformLocation | null> = {};
  for (const n of ['uTex', 'uRes', 'uUnit', 'uPose', 'uGlowShape', 'uBg', 'uWarp', 'uMix', 'uPhase']) {
    loc[n] = gl.getUniformLocation(prog, n);
  }
  const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  (tex as unknown as { aniso: unknown }).aniso = aniso;
  return { gl, prog, tex, buf, loc };
}

function uploadCards(st: GLState, canvases: HTMLCanvasElement[]) {
  if (!canvases.length) return;
  const { gl, tex } = st;
  const w = canvases[0].width;
  const h = canvases[0].height;
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
  gl.texImage3D(
    gl.TEXTURE_2D_ARRAY,
    0,
    gl.RGBA8,
    w,
    h,
    canvases.length,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  canvases.forEach((cv, i) => {
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, w, h, 1, gl.RGBA, gl.UNSIGNED_BYTE, cv);
  });
  gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const an = (tex as unknown as { aniso: { TEXTURE_MAX_ANISOTROPY_EXT: number } | null }).aniso;
  if (an) gl.texParameterf(gl.TEXTURE_2D_ARRAY, an.TEXTURE_MAX_ANISOTROPY_EXT, 8);
}

function drawFallback(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  unit: number,
  poses: { pose: Pose; layer: number }[],
  canvases: HTMLCanvasElement[],
  bg: string
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const proj = (X: number, Zb: number, Y: number) => {
    const D = FOCAL + Zb;
    return [w / 2 + ((X * FOCAL) / D) * unit, h / 2 - ((Y * FOCAL) / D) * unit];
  };
  const items = poses
    .filter((p) => p.layer >= 0)
    .map((p) => ({ ...p, depth: p.pose[1] }))
    .sort((a, b) => b.depth - a.depth);
  const strips = 28;
  const eps = 1.5 / Math.max(unit, 0.25);
  const half = CW / 2;
  const edgeY = (sv: number) => {
    const dx = Math.abs(sv) - (half - CR);
    if (dx <= 0) return CH / 2;
    return CH / 2 - CR + Math.sqrt(Math.max(0, CR * CR - Math.min(dx, CR) ** 2));
  };

  for (const it of items) {
    const [cx, zb, psi] = it.pose;
    const cv = canvases[it.layer];
    if (!cv) continue;
    const tpu = cv.width / CW;
    const cs = Math.cos(psi);
    const sn = Math.sin(psi);
    const at = (sv: number, y: number) => proj(cx + sv * cs, zb + sv * sn, y);
    for (let i = 0; i < strips; i++) {
      const s0 = -half + (CW * i) / strips - (i > 0 ? eps : 0);
      const s1 = -half + (CW * (i + 1)) / strips + (i < strips - 1 ? eps : 0);
      if (FOCAL + zb + s0 * sn < 10 || FOCAL + zb + s1 * sn < 10) continue;
      const n = Math.abs(s0) > half - CR - 1 || Math.abs(s1) > half - CR - 1 ? 6 : 1;
      ctx.save();
      ctx.beginPath();
      for (let k = 0; k <= n; k++) {
        const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * k) / n));
        const pt = at(sv, edgeY(sv));
        if (k === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      }
      for (let k = n; k >= 0; k--) {
        const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * k) / n));
        const pt = at(sv, -edgeY(sv));
        ctx.lineTo(pt[0], pt[1]);
      }
      ctx.closePath();
      ctx.clip();
      const sm = (s0 + s1) / 2;
      const tl = at(s0, CH / 2);
      const tr = at(s1, CH / 2);
      const mt = at(sm, CH / 2);
      const mb = at(sm, -CH / 2);
      const sx0 = (s0 + half) * tpu;
      const sw = (s1 - s0) * tpu;
      const ov = 1.025;
      const a = (tr[0] - tl[0]) / sw;
      const b = (tr[1] - tl[1]) / sw;
      const c = ((mb[0] - mt[0]) / cv.height) * ov;
      const d = ((mb[1] - mt[1]) / cv.height) * ov;
      const smx = (sm + half) * tpu;
      const ox = (mt[0] + mb[0]) / 2 - a * smx - c * (cv.height / 2);
      const oy = (mt[1] + mb[1]) / 2 - b * smx - d * (cv.height / 2);
      ctx.setTransform(a, b, c, d, ox, oy);
      const x0 = Math.max(0, sx0 - 1);
      const x1 = Math.min(cv.width, sx0 + sw + 1);
      ctx.drawImage(cv, x0, 0, x1 - x0, cv.height, x0, 0, x1 - x0, cv.height);
      ctx.restore();
    }
  }
}

const mod = (a: number, n: number) => ((a % n) + n) % n;

interface Live {
  P: number;
  to: number;
  v: number;
  mode: 'drift' | 'drag' | 'coast' | 'spring';
  hoveringCenter: boolean;
  driftResumeAt: number;
  dragX: number;
  dragP: number;
  downX: number;
  moved: boolean;
  lastT: number;
  visible: boolean;
  lastReportedIdx: number;
}

function computeUnitCss(cssW: number, cssH: number): number {
  const idealWidthUnits = cssW >= 960 ? 1080 : cssW >= 620 ? 900 : 620;
  return Math.min(cssW / idealWidthUnits, cssH / 380);
}

export const PortfolioWarpCarousel = React.forwardRef<
  PortfolioWarpCarouselHandle,
  PortfolioWarpCarouselProps
>(function PortfolioWarpCarousel(
  {
    projects,
    onOpenProject,
    onActiveChange,
    autoplay = true,
    background = '#EFEFE9',
    warp = 0.92,
    className = '',
    style,
  },
  ref
) {
  const { lang } = useLanguage();
  const { playPluck, playHover } = useSound();

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [cursorHint, setCursorHint] = React.useState<'open' | 'turn'>('open');
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  const list = React.useMemo(() => {
    const out = [...projects];
    while (out.length > 0 && out.length < 6) out.push(...projects);
    return out;
  }, [projects]);

  const N = list.length;

  const live = React.useRef<Live>({
    P: 0,
    to: 0,
    v: 0,
    mode: 'drift',
    hoveringCenter: false,
    driftResumeAt: 0,
    dragX: 0,
    dragP: 0,
    downX: 0,
    moved: false,
    lastT: performance.now() / 1000,
    visible: true,
    lastReportedIdx: 0,
  });

  const handles = React.useRef<{ kick: () => void; draw: () => void }>({
    kick: () => {},
    draw: () => {},
  });

  const propsRef = React.useRef({
    onActiveChange,
    autoplay,
    reduced,
    projects,
    playHover,
  });
  propsRef.current = { onActiveChange, autoplay, reduced, projects, playHover };

  const spinBy = React.useCallback((delta: number) => {
    const L = live.current;
    const now = performance.now() / 1000;
    const base = L.mode === 'spring' ? L.to : Math.round(L.P);
    L.to = base + delta;
    L.mode = 'spring';
    L.lastT = now;
    L.driftResumeAt = now + 1.8;
    handles.current.kick();
  }, []);

  const impulseWheel = React.useCallback((delta: number) => {
    const L = live.current;
    const now = performance.now() / 1000;
    // Responsive real-time angular velocity directly driven by mouse wheel / trackpad
    L.v = Math.max(-16, Math.min(16, L.v + delta * 0.0145));
    if (L.mode !== 'drag') {
      L.mode = 'coast';
    }
    L.lastT = now;
    L.driftResumeAt = now + 2.0;
    handles.current.kick();
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      next: () => {
        playHover();
        spinBy(1);
      },
      prev: () => {
        playHover();
        spinBy(-1);
      },
      impulseWheel,
    }),
    [playHover, spinBy, impulseWheel]
  );

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || N === 0) return;

    let gls: GLState | null = createGL(canvas);
    let ctx2d: CanvasRenderingContext2D | null = null;
    if (!gls) ctx2d = canvas.getContext('2d');
    let cardCanvases: HTMLCanvasElement[] = [];
    const loadedImgs: (HTMLImageElement | null)[] = new Array(N).fill(null);
    let texW = 0;
    let raf = 0;
    let disposed = false;

    const bg = parseColor(background, [239, 239, 233]);

    const paintOne = (i: number, w: number) => {
      if (!cardCanvases[i]) {
        cardCanvases[i] = document.createElement('canvas');
      }
      const cv = cardCanvases[i];
      cv.width = w;
      cv.height = Math.round((w * CH) / CW);
      paintProjectCard(cv, list[i], loadedImgs[i], DEFAULT_FONT);
    };

    const paintAll = (w: number) => {
      cardCanvases = list.map((p, i) => {
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = Math.round((w * CH) / CW);
        paintProjectCard(cv, p, loadedImgs[i], DEFAULT_FONT);
        return cv;
      });
      texW = w;
      if (gls) uploadCards(gls, cardCanvases);
    };

    list.forEach((p, i) => {
      const im = new Image();
      if (/^https?:\/\//i.test(p.coverImage)) {
        im.crossOrigin = 'anonymous';
      }
      im.onload = () => {
        if (disposed) return;
        loadedImgs[i] = im;
        if (texW > 0) {
          paintOne(i, texW);
          if (gls) uploadCards(gls, cardCanvases);
          handles.current.draw();
        }
      };
      im.src = p.coverImage;
    });

    let W = 0;
    let H = 0;
    let unit = 1;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(2, Math.round(r.width * dpr));
      H = Math.max(2, Math.round(r.height * dpr));
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;
      unit = computeUnitCss(r.width, r.height) * dpr;
      const want = Math.min(1024, Math.max(256, Math.round(CW * unit * 1.4)));
      if (want !== texW) paintAll(want);
    };

    const poseSet = (P: number) => {
      const ids = Array.from({ length: N }, (_, c) => ({ c, q: mod(c - P + N / 2, N) - N / 2 }))
        .sort((a, b) => Math.abs(a.q) - Math.abs(b.q))
        .slice(0, SLOTS);
      return ids.map(({ c, q }) =>
        Math.abs(q) > 2.6 ? { pose: [0, 0, 0] as Pose, layer: -1 } : { pose: poseAt(q), layer: c }
      );
    };

    const L = live.current;

    const syncActive = (P: number) => {
      const realLen = propsRef.current.projects.length;
      if (!realLen) return;
      const idx = mod(Math.round(P), realLen);
      if (idx !== L.lastReportedIdx) {
        L.lastReportedIdx = idx;
        propsRef.current.onActiveChange?.(propsRef.current.projects[idx], idx);
        if (L.mode === 'coast' || L.mode === 'drag') {
          propsRef.current.playHover();
        }
      }
    };

    const stepPhysics = (now: number) => {
      const dt = Math.min(0.034, Math.max(0.001, now - L.lastT));
      L.lastT = now;

      if (L.mode === 'coast') {
        L.P += L.v * dt;
        L.v *= Math.exp(-3.2 * dt);
        if (Math.abs(L.v) < 0.22) {
          L.to = Math.round(L.P);
          L.mode = 'spring';
          L.driftResumeAt = now + 1.8;
        }
      } else if (L.mode === 'spring') {
        const sub = 4;
        for (let i = 0; i < sub; i++) {
          const acc = -76 * (L.P - L.to) - 14.5 * L.v;
          L.v += (acc * dt) / sub;
          L.P += (L.v * dt) / sub;
        }
        if (Math.abs(L.P - L.to) < 6e-4 && Math.abs(L.v) < 4e-3) {
          L.P = L.to;
          L.v = 0;
          L.mode = 'drift';
        }
      } else if (L.mode === 'drift') {
        const p = propsRef.current;
        if (p.autoplay && !p.reduced && now >= L.driftResumeAt) {
          const targetSpeed = L.hoveringCenter ? 0.02 : 0.16;
          L.v += (targetSpeed - L.v) * Math.min(1, dt * 4.5);
          L.P += L.v * dt;
        } else {
          L.v = 0;
        }
      }

      syncActive(L.P);
    };

    const poseArr = new Float32Array(SLOTS * 2 * 4);
    const shapeArr = new Float32Array(SLOTS * 2 * 3);
    const fill = (set: { pose: Pose; layer: number }[], off: number) => {
      set.forEach((s, i) => {
        const j = off + i;
        poseArr[j * 4] = s.pose[0];
        poseArr[j * 4 + 1] = s.pose[1];
        poseArr[j * 4 + 2] = s.pose[2];
        poseArr[j * 4 + 3] = s.layer;
        const gs = s.layer >= 0 ? glowShape(s.pose) : [0, 1, 0];
        shapeArr[j * 3] = gs[0];
        shapeArr[j * 3 + 1] = gs[1];
        shapeArr[j * 3 + 2] = gs[2];
      });
    };

    const draw = (now: number) => {
      if (disposed) return;
      stepPhysics(now);
      const setA = poseSet(L.P);
      if (gls) {
        const { gl, prog, loc } = gls;
        gl.viewport(0, 0, W, H);
        gl.useProgram(prog);
        fill(setA, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, gls.tex);
        gl.uniform1i(loc.uTex, 0);
        gl.uniform2f(loc.uRes, W, H);
        gl.uniform1f(loc.uUnit, unit);
        gl.uniform4fv(loc.uPose, poseArr);
        gl.uniform3fv(loc.uGlowShape, shapeArr);
        gl.uniform3f(loc.uBg, bg[0] / 255, bg[1] / 255, bg[2] / 255);
        gl.uniform1f(loc.uWarp, Math.max(0, Math.min(1, warp)));
        gl.uniform1f(loc.uMix, 0);
        gl.uniform1f(loc.uPhase, L.P);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else if (ctx2d) {
        const css = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`;
        drawFallback(ctx2d, W, H, unit, setA, cardCanvases, css);
      }
    };

    const loop = () => {
      raf = 0;
      if (disposed || !L.visible) return;
      const now = performance.now() / 1000;
      draw(now);
      const p = propsRef.current;
      const busy = L.mode !== 'drift' || (p.autoplay && !p.reduced);
      if (busy) raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!raf && !disposed && L.visible) {
        L.lastT = performance.now() / 1000;
        raf = requestAnimationFrame(loop);
      }
    };
    handles.current = {
      kick,
      draw: () => {
        L.lastT = performance.now() / 1000;
        draw(L.lastT);
      },
    };

    const t0 = performance.now() / 1000;
    L.lastT = t0;
    L.driftResumeAt = t0 + 0.35;
    resize();

    const ro = new ResizeObserver(() => {
      resize();
      handles.current.draw();
    });
    ro.observe(wrap);

    const setVisible = (vis: boolean) => {
      L.visible = vis;
      if (vis) {
        L.lastT = performance.now() / 1000;
        kick();
      }
    };

    let inView = true;
    const io = new IntersectionObserver((ents) => {
      inView = ents.some((e) => e.isIntersecting);
      setVisible(inView && document.visibilityState === 'visible');
    });
    io.observe(wrap);
    const onVis = () => setVisible(inView && document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    const onRestored = () => {
      if (!lost) return;
      lost = false;
      gls = createGL(canvas);
      texW = 0;
      resize();
      kick();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const fonts = (document as unknown as { fonts?: FontFaceSet }).fonts;
    const repaint = () => {
      if (disposed) return;
      texW = 0;
      resize();
      handles.current.draw();
    };
    fonts?.addEventListener?.('loadingdone', repaint);

    draw(t0);
    kick();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      fonts?.removeEventListener?.('loadingdone', repaint);
      if (gls) {
        gls.gl.deleteTexture(gls.tex);
        gls.gl.deleteBuffer(gls.buf);
        gls.gl.deleteProgram(gls.prog);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, lang, background, warp, N]);

  /* ---------------- Interaction ---------------- */
  const getStageU = (clientX: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    const unitCss = computeUnitCss(r.width, r.height);
    return (clientX - r.left - r.width / 2) / unitCss;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button > 0) return;
    const L = live.current;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    L.mode = 'drag';
    L.dragX = e.clientX;
    L.downX = e.clientX;
    L.dragP = L.P;
    L.v = 0;
    L.moved = false;
    L.lastT = performance.now() / 1000;
    playPluck(1.08);
    handles.current.kick();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const L = live.current;
    if (L.mode !== 'drag') {
      const u = getStageU(e.clientX);
      const isCenter = Math.abs(u) <= 145;
      L.hoveringCenter = isCenter;
      setCursorHint(isCenter ? 'open' : 'turn');
      return;
    }
    const r = wrapRef.current!.getBoundingClientRect();
    const unitCss = computeUnitCss(r.width, r.height);
    const now = performance.now() / 1000;
    const P = L.dragP - (e.clientX - L.dragX) / (unitCss * 280);
    const dt = Math.max(1 / 240, now - L.lastT);
    L.v = 0.6 * L.v + 0.4 * ((P - L.P) / dt);
    L.P = P;
    L.lastT = now;
    if (Math.abs(e.clientX - L.downX) > 6) L.moved = true;
    handles.current.draw();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const L = live.current;
    if (L.mode !== 'drag') return;
    const now = performance.now() / 1000;

    if (!L.moved) {
      L.mode = 'drift';
      const u = getStageU(e.clientX);
      if (u > 145) {
        playPluck(0.95);
        spinBy(1);
      } else if (u < -145) {
        playPluck(0.95);
        spinBy(-1);
      } else {
        const activeProj = projects[mod(Math.round(L.P), projects.length)];
        if (activeProj) onOpenProject(activeProj);
      }
      return;
    }

    if (now - L.lastT > 0.08) L.v = 0;
    L.to = Math.round(L.P + L.v * 0.22);
    L.mode = 'spring';
    L.lastT = now;
    L.driftResumeAt = now + 1.8;
    playPluck(0.92);
    handles.current.kick();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      playHover();
      spinBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      playHover();
      spinBy(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const activeProj = projects[mod(Math.round(live.current.P), projects.length)];
      if (activeProj) onOpenProject(activeProj);
    }
  };

  const front = projects[mod(live.current.lastReportedIdx, projects.length)];
  const cursorLabel =
    cursorHint === 'open'
      ? lang === 'ru'
        ? 'Открыть кейс'
        : 'Open case'
      : lang === 'ru'
      ? 'Листать'
      : 'Spin';

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={lang === 'ru' ? 'Галерея проектов' : 'Portfolio carousel'}
      tabIndex={0}
      data-cursor={cursorLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => {
        live.current.hoveringCenter = false;
      }}
      onKeyDown={onKeyDown}
      className={`relative w-full overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing outline-none ${className}`}
      style={{
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full block"
      />
      <div className="sr-only" aria-live="polite">
        {front ? (lang === 'ru' ? front.title.ru : front.title.en) : ''}
      </div>
    </div>
  );
});
