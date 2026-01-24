'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { PerspectiveCamera, Stars } from '@react-three/drei';

function FloatingShape() {
    const meshRef = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={[2, 0, 0]}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#D91C2B" wireframe />
        </mesh>
    );
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FloatingShape />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
