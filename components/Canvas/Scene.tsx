'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { PerspectiveCamera, Stars, Text, Float } from '@react-three/drei';

// Clustered Zones Configuration
// position: Where the object/text is located
// camPos: Where the camera should be positioned
// camLookAt: Where the camera should look
const ZONES = {
    home: {
        position: new Vector3(0, 0, 0),
        camPos: new Vector3(0, 0, 10),
        camLookAt: new Vector3(0, 0, 0),
        color: "#D91C2B",
        label: "HOME"
    },
    skills: {
        position: new Vector3(-10, 5, -10),
        camPos: new Vector3(-18, 5, 5),
        camLookAt: new Vector3(-10, 5, -10),
        color: "#ffe600",
        label: "SKILLS"
    },
    projects: {
        position: new Vector3(12, -5, -8),
        camPos: new Vector3(18, -2, 5),
        camLookAt: new Vector3(12, -5, -8),
        color: "#00ccff",
        label: "PROJECTS"
    },
    contact: {
        position: new Vector3(0, 10, -15),
        camPos: new Vector3(0, 0, -5),
        camLookAt: new Vector3(0, 10, -15),
        color: "#ff00ff",
        label: "CONTACT"
    }
};

function CameraRig({ activeSection }: { activeSection: string }) {
    const { camera } = useThree();
    const targetPos = useRef(new Vector3().copy(ZONES.home.camPos));
    const targetLook = useRef(new Vector3().copy(ZONES.home.camLookAt));
    const currentLook = useRef(new Vector3().copy(ZONES.home.camLookAt));

    useEffect(() => {
        const section = activeSection as keyof typeof ZONES;
        if (ZONES[section]) {
            targetPos.current.copy(ZONES[section].camPos);
            targetLook.current.copy(ZONES[section].camLookAt);
        }
    }, [activeSection]);

    useFrame((state, delta) => {
        const speed = 50; // Units per second - adjustable for desired snap

        // Linear movement for Position
        const posError = new Vector3().subVectors(targetPos.current, state.camera.position);
        const dist = posError.length();

        if (dist > 0.01) {
            const step = Math.min(dist, speed * delta);
            state.camera.position.add(posError.normalize().multiplyScalar(step));
        } else {
            state.camera.position.copy(targetPos.current);
        }

        // Linear movement for LookAt target
        const lookError = new Vector3().subVectors(targetLook.current, currentLook.current);
        const lookDist = lookError.length();

        if (lookDist > 0.01) {
            const step = Math.min(lookDist, speed * delta);
            currentLook.current.add(lookError.normalize().multiplyScalar(step));
        } else {
            currentLook.current.copy(targetLook.current);
        }

        state.camera.lookAt(currentLook.current);
    });

    return null;
}

function SectionZone({ zoneKey }: { zoneKey: keyof typeof ZONES }) {
    const { position, color, label } = ZONES[zoneKey];

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <boxGeometry args={[3, 3, 3]} />
                    <meshStandardMaterial color={color} wireframe />
                </mesh>
            </Float>
            <Text
                position={[0, -2.5, 0]}
                fontSize={1.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}

export default function Scene({ activeSection }: { activeSection: string }) {
    return (
        <div className="fixed inset-0 z-0 bg-neutral-900">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="blue" />

                <CameraRig activeSection={activeSection} />

                {Object.keys(ZONES).map((key) => (
                    <SectionZone key={key} zoneKey={key as keyof typeof ZONES} />
                ))}

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
