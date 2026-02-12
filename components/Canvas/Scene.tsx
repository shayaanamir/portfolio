'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useMemo, useState } from 'react';
import { Vector3, Object3D } from 'three';
import { PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';

// Zone type definition
type Zone = {
    position: Vector3;
    camPos: Vector3;
    camLookAt: Vector3;
    color: string;
    label: string;
};

type ZonesConfig = {
    [key: string]: Zone;
};

// Default zones as fallback if GLB doesn't load
const DEFAULT_ZONES: ZonesConfig = {
    home: {
        position: new Vector3(0, 0, 0),
        camPos: new Vector3(0, 0, 10),
        camLookAt: new Vector3(0, 0, 0),
        color: "#D91C2B",
        label: "HOME"
    },
    about: {
        position: new Vector3(-10, 5, -10),
        camPos: new Vector3(-18, 5, 5),
        camLookAt: new Vector3(-10, 5, -10),
        color: "#ffe600",
        label: "ABOUT"
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

function CameraRig({ activeSection, zones }: { activeSection: string; zones: ZonesConfig }) {
    const { camera } = useThree();
    const hasInitialized = useRef(false);
    const [introFinished, setIntroFinished] = useState(false);
    const targetPos = useRef(new Vector3().copy(zones.home.camPos));
    const targetLook = useRef(new Vector3().copy(zones.home.camLookAt));
    const currentLook = useRef(new Vector3().copy(zones.home.camLookAt));

    useEffect(() => {
        console.log(`🎥 ActiveSection Changed: ${activeSection}, IntroFinished: ${introFinished}`);
        // Only update targets if intro is finished or if we aren't using the start animation
        if (introFinished && zones[activeSection]) {
            console.log(`🎯 Moving camera to ${activeSection}`);
            targetPos.current.copy(zones[activeSection].camPos);
            targetLook.current.copy(zones[activeSection].camLookAt);
        } else {
            console.log("🔒 Camera Movement Blocked (Intro not finished or Invalid Zone)");
        }
    }, [activeSection, zones, introFinished]);

    // Initialize camera position on first load
    useEffect(() => {
        console.log("params check:", {
            isDefault: zones === DEFAULT_ZONES,
            hasStart: !!zones.start,
            hasHome: !!zones.home,
            hasInit: hasInitialized.current
        });

        if (zones === DEFAULT_ZONES) return;

        if (!hasInitialized.current) {
            console.log("🎬 Initialization Triggered");

            // Priority 1: Start position from GLB
            if (zones.start) {
                console.log("🎬 Start Zone Found. Beginning Seq.");
                camera.position.copy(zones.start.camPos);
                camera.lookAt(zones.start.camLookAt);

                // Set initial targets to start position so it stays there
                targetPos.current.copy(zones.start.camPos);
                targetLook.current.copy(zones.start.camLookAt);
                currentLook.current.copy(zones.start.camLookAt);

                hasInitialized.current = true;

                // After delay, move to home
                setTimeout(() => {
                    console.log("🎬 Time complete. Moving Home & Unlocking.");
                    if (zones.home) {
                        targetPos.current.copy(zones.home.camPos);
                        targetLook.current.copy(zones.home.camLookAt);
                    }
                    setIntroFinished(true); // CRITICAL FIX
                }, 1000); // 2.5s delay at start position
            }
            // Priority 2: Fallback to Home position (no animation)
            else if (zones.home) {
                console.log("ℹ️ No Start Zone. Snapping Home & Unlocking.");
                camera.position.copy(zones.home.camPos);
                camera.lookAt(zones.home.camLookAt);

                targetPos.current.copy(zones.home.camPos);
                targetLook.current.copy(zones.home.camLookAt);
                currentLook.current.copy(zones.home.camLookAt);

                hasInitialized.current = true;
                setIntroFinished(true);
            }
        }
    }, [camera, zones]);

    useFrame((state, delta) => {
        const speed = 1000; // Adjusted for visible pan animation

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

function SceneModel({ onZonesExtracted }: { onZonesExtracted: (zones: ZonesConfig) => void }) {
    const { scene } = useGLTF('/models/scene.glb');

    const zones = useMemo(() => {
        const extractedZones: ZonesConfig = {};
        const sections = ['home', 'about', 'projects', 'contact', 'start'];
        const colors = ['#D91C2B', '#ffe600', '#00ccff', '#ff00ff', '#ffffff'];

        sections.forEach((section, index) => {
            const capitalizedSection = section.charAt(0).toUpperCase() + section.slice(1);
            const posName = `CamPos_${capitalizedSection}`;
            const targetName = `CamTarget_${capitalizedSection}`;

            let camPosObj: Object3D | undefined;
            let camTargetObj: Object3D | undefined;

            // Find the empties in the scene
            scene.traverse((child) => {
                if (child.name === posName) {
                    camPosObj = child;
                }
                if (child.name === targetName) {
                    camTargetObj = child;
                }
            });

            if (camPosObj && camTargetObj) {
                // Get world positions
                const camPos = new Vector3();
                const camTarget = new Vector3();
                camPosObj.getWorldPosition(camPos);
                camTargetObj.getWorldPosition(camTarget);

                extractedZones[section] = {
                    position: camTarget.clone(), // Use target as the zone position
                    camPos: camPos,
                    camLookAt: camTarget,
                    color: colors[index],
                    label: section.toUpperCase()
                };

                console.log(`✓ Extracted ${section}: CamPos(${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)}), Target(${camTarget.x.toFixed(2)}, ${camTarget.y.toFixed(2)}, ${camTarget.z.toFixed(2)})`);
            } else {
                console.warn(`⚠ Missing empties for ${section}: ${posName} or ${targetName} not found`);
            }
        });

        // Use default zones if extraction failed
        const finalZones = Object.keys(extractedZones).length === sections.length
            ? extractedZones
            : DEFAULT_ZONES;

        if (Object.keys(extractedZones).length !== sections.length) {
            console.warn('⚠ Using default zones as fallback');
        }

        return finalZones;
    }, [scene]);

    useEffect(() => {
        onZonesExtracted(zones);
    }, [zones, onZonesExtracted]);

    return <primitive object={scene} />;
}

export default function Scene({ activeSection }: { activeSection: string }) {
    const [zones, setZones] = useState<ZonesConfig>(DEFAULT_ZONES);

    const handleZonesExtracted = (newZones: ZonesConfig) => {
        setZones(newZones);
    };

    return (
        <div className="fixed inset-0 z-0 bg-neutral-900">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="blue" />

                <CameraRig activeSection={activeSection} zones={zones} />

                <SceneModel onZonesExtracted={handleZonesExtracted} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
}
