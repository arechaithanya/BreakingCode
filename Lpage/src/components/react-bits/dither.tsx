/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g10, g10), dot(g01, g01), dot(g11, g11)));
  g00 *= norm.x; g10 *= norm.y; g01 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 dur = fade(Pf.xy);
  float n_x = mix(n00, n10, dur.x);
  float n_y = mix(n01, n11, dur.x);
  return 2.3 * mix(n_x, n_y, dur.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float t = time * waveSpeed;
  float noise = cnoise(uv * waveFrequency + t);
  float dist = 0.0;
  if(enableMouseInteraction == 1) {
    dist = distance(uv, mousePos);
  }
  float effect = smoothstep(mouseRadius, 0.0, dist);
  float finalWave = noise * waveAmplitude + (effect * 0.2);
  gl_FragColor = vec4(waveColor * (0.5 + finalWave), 1.0);
}
`;

const ditherFragmentShader = `
uniform int colorNum;
uniform float pixelSize;
uniform vec2 resolution;

float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int index = x + y * 4;
  if (index == 0) return 0.0625; if (index == 1) return 0.5625; if (index == 2) return 0.1875; if (index == 3) return 0.6875;
  if (index == 4) return 0.8125; if (index == 5) return 0.3125; if (index == 6) return 0.9375; if (index == 7) return 0.4375;
  if (index == 8) return 0.25; if (index == 9) return 0.75; if (index == 10) return 0.125; if (index == 11) return 0.625;
  if (index == 12) return 1.0; if (index == 13) return 0.5; if (index == 14) return 0.875; if (index == 15) return 0.375;
  return 0.0;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 screenPos = uv * resolution;
  vec2 ditherPos = floor(screenPos / pixelSize);
  float threshold = bayer4(ditherPos);
  vec3 color = inputColor.rgb;
  color = floor(color * float(colorNum) + threshold - 0.5) / float(colorNum - 1);
  outputColor = vec4(color, inputColor.a);
}
`;

class DitherShader extends Effect {
  constructor({ colorNum = 4, pixelSize = 2, resolution = new THREE.Vector2() } = {}) {
    super('DitherShader', ditherFragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ['colorNum', new THREE.Uniform(colorNum)],
        ['pixelSize', new THREE.Uniform(pixelSize)],
        ['resolution', new THREE.Uniform(resolution)]
      ])
    });
  }
}

const RetroEffect = wrapEffect(DitherShader);

interface WaveUniforms {
  [key: string]: THREE.IUniform<any>;
  time: THREE.Uniform<number>;
  resolution: THREE.Uniform<THREE.Vector2>;
  waveSpeed: THREE.Uniform<number>;
  waveFrequency: THREE.Uniform<number>;
  waveAmplitude: THREE.Uniform<number>;
  waveColor: THREE.Uniform<THREE.Color>;
  mousePos: THREE.Uniform<THREE.Vector2>;
  enableMouseInteraction: THREE.Uniform<number>;
  mouseRadius: THREE.Uniform<number>;
}

interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: number[];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

const DitheredWaves = ({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius
}: DitheredWavesProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { size, gl, viewport } = useThree();

  const waveUniformsRef = useRef<WaveUniforms>({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius)
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    waveUniformsRef.current.resolution.value.set(size.width * dpr, size.height * dpr);
  }, [size, gl]);

  useFrame(({ clock, mouse }) => {
    if (!disableAnimation) {
      waveUniformsRef.current.time.value = clock.getElapsedTime();
    }
    if (enableMouseInteraction) {
      mouseRef.current.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);
      waveUniformsRef.current.mousePos.value.copy(mouseRef.current);
    }
  });

  return (
    <>
      <mesh ref={mesh}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>
      {/* @ts-ignore */}
      <EffectComposer disableNormalPass>
        <RetroEffect
          colorNum={colorNum}
          pixelSize={pixelSize}
          resolution={new THREE.Vector2(size.width, size.height)}
        />
      </EffectComposer>
    </>
  );
};

interface DitherProps extends Partial<DitheredWavesProps> {
  className?: string;
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.2, 0.6, 1.0], // Neon blue-ish
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  className = ""
}: DitherProps) {
  return (
    <div className={`w-full h-full relative overflow-hidden bg-black ${className}`}>
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        <DitheredWaves
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
        />
      </Canvas>
    </div>
  );
}
