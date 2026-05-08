import React, { Suspense, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import './styles.css';

const palettes = {
  storm: { name: 'Storm Runner', upper: '#1f2937', sole: '#f8fafc', lace: '#38bdf8', accent: '#f97316' },
  volt: { name: 'Volt Lab', upper: '#111827', sole: '#d1fae5', lace: '#a3e635', accent: '#22c55e' },
  royal: { name: 'Royal Court', upper: '#1e3a8a', sole: '#f1f5f9', lace: '#facc15', accent: '#ef4444' },
  sand: { name: 'Desert Tech', upper: '#92400e', sole: '#fef3c7', lace: '#0f172a', accent: '#fb923c' },
};

const materials = ['Mesh Knit', 'Patent Leather', 'Suede Panel', 'Ripstop Nylon'];
const laceStyles = ['Classic Flat', 'Rope Lace', 'Trail Toggle', 'Glow Cord'];
const silhouettes = ['Low Top', 'Mid Top', 'Runner', 'Court'];

function ShoeModel({ config }) {
  const palette = palettes[config.palette];
  const materialRoughness = config.material === 'Patent Leather' ? 0.22 : config.material === 'Suede Panel' ? 0.88 : 0.55;
  const upperHeight = config.silhouette === 'Mid Top' ? 0.95 : config.silhouette === 'Runner' ? 0.62 : 0.72;
  const soleLift = config.silhouette === 'Runner' ? 0.28 : 0.2;

  const laceBars = useMemo(() => Array.from({ length: 6 }, (_, i) => -1.05 + i * 0.42), []);

  return (
    <group rotation={[0.02, -0.38, 0]} position={[0, -0.25, 0]}>
      <mesh position={[0, 0, 0]} scale={[2.35, soleLift, 0.72]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={palette.sole} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, 0.34, 0]} scale={[1.92, upperHeight, 0.62]} castShadow>
        <capsuleGeometry args={[0.48, 1.18, 10, 24]} />
        <meshStandardMaterial color={palette.upper} roughness={materialRoughness} metalness={0.02} />
      </mesh>
      <mesh position={[0.84, 0.38, 0]} scale={[0.78, 0.46, 0.58]} castShadow>
        <sphereGeometry args={[0.58, 32, 16]} />
        <meshStandardMaterial color={palette.upper} roughness={materialRoughness} />
      </mesh>
      <mesh position={[-0.94, 0.45, 0]} scale={[0.52, 0.52, 0.58]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={palette.accent} roughness={0.42} />
      </mesh>
      <mesh position={[0.13, 0.9, 0.35]} rotation={[0.8, 0, 0]} scale={[0.72, 0.18, 0.08]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={palette.accent} roughness={0.36} />
      </mesh>
      {laceBars.map((x, index) => (
        <mesh key={x} position={[x, 0.96, 0.47]} rotation={[0.72, 0, index % 2 ? 0.22 : -0.22]} scale={[0.34, 0.035, 0.035]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={palette.lace} roughness={0.2} emissive={config.lace === 'Glow Cord' ? palette.lace : '#000000'} emissiveIntensity={config.lace === 'Glow Cord' ? 0.35 : 0} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.18, 0.76]} scale={[1.4, 0.12, 0.045]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={palette.accent} roughness={0.26} />
      </mesh>
    </group>
  );
}

function OptionButton({ active, children, onClick }) {
  return <button className={active ? 'option active' : 'option'} onClick={onClick}>{children}</button>;
}

function App() {
  const [config, setConfig] = useState({ palette: 'storm', material: materials[0], lace: laceStyles[0], silhouette: silhouettes[0] });
  const palette = palettes[config.palette];
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">ShoeLab 3D Prototype</p>
          <h1>Build the custom sneaker before it exists.</h1>
          <p className="summary">Mobile-first shoe studio with live 3D preview, lace selection, material selection, colorways, and a ready-to-share design summary.</p>
          <div className="status-row">
            <span>Live prototype</span>
            <span>3D preview</span>
            <span>iPhone/Samsung ready</span>
          </div>
        </div>
        <div className="viewer-card" aria-label="3D sneaker preview">
          <Canvas camera={{ position: [0, 2.2, 4.2], fov: 44 }} shadows>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 4]} intensity={1.8} castShadow />
            <Suspense fallback={null}>
              <ShoeModel config={config} />
              <Environment preset="city" />
              <ContactShadows position={[0, -0.62, 0]} opacity={0.38} scale={6} blur={2.2} far={3} />
            </Suspense>
            <OrbitControls enablePan={false} minDistance={3} maxDistance={6} />
          </Canvas>
        </div>
      </section>

      <section className="designer-grid">
        <div className="panel">
          <h2>Colorway</h2>
          <div className="option-grid">
            {Object.entries(palettes).map(([key, value]) => (
              <OptionButton key={key} active={config.palette === key} onClick={() => update('palette', key)}>
                <span className="swatch-row"><i style={{ background: value.upper }} /><i style={{ background: value.sole }} /><i style={{ background: value.lace }} /></span>
                {value.name}
              </OptionButton>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Material</h2>
          <div className="option-grid compact">
            {materials.map((item) => <OptionButton key={item} active={config.material === item} onClick={() => update('material', item)}>{item}</OptionButton>)}
          </div>
        </div>

        <div className="panel">
          <h2>Laces</h2>
          <div className="option-grid compact">
            {laceStyles.map((item) => <OptionButton key={item} active={config.lace === item} onClick={() => update('lace', item)}>{item}</OptionButton>)}
          </div>
        </div>

        <div className="panel">
          <h2>Silhouette</h2>
          <div className="option-grid compact">
            {silhouettes.map((item) => <OptionButton key={item} active={config.silhouette === item} onClick={() => update('silhouette', item)}>{item}</OptionButton>)}
          </div>
        </div>
      </section>

      <section className="build-sheet">
        <div>
          <p className="eyebrow">Current Build</p>
          <h2>{palette.name} / {config.silhouette}</h2>
          <p>{config.material} upper, {config.lace.toLowerCase()} lacing, {palette.accent} accent package.</p>
        </div>
        <button className="primary" onClick={() => navigator.clipboard?.writeText(`ShoeLab build: ${palette.name}, ${config.silhouette}, ${config.material}, ${config.lace}`)}>Copy build summary</button>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
