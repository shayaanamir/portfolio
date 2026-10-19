'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useMemo, useState } from 'react';
import { Vector3, Object3D, Material, MeshStandardMaterial, Mesh } from 'three';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BillboardContent } from './BillboardContent';

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
    experience: {
        position: new Vector3(-8, -5, -8),
        camPos: new Vector3(-12, -2, 5),
        camLookAt: new Vector3(-8, -5, -8),
        color: "#ff4d00",
        label: "EXPERIENCE"
    },
    contact: {
        position: new Vector3(0, 10, -15),
        camPos: new Vector3(0, 0, -5),
        camLookAt: new Vector3(0, 10, -15),
        color: "#ff00ff",
        label: "CONTACT"
    }
};

function CameraRig({
    activeSection,
    zones,
    onIntroComplete,
}: {
    activeSection: string;
    zones: ZonesConfig;
    onIntroComplete?: () => void;
}) {
    const { camera } = useThree();
    const hasInitialized = useRef(false);
    const introNotifiedRef = useRef(false);
    const [introFinished, setIntroFinished] = useState(false);
    const [isIntroTransition, setIsIntroTransition] = useState(false);
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
                        setIsIntroTransition(true); // Enable ease-in for intro transition
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
                if (!introNotifiedRef.current) {
                    introNotifiedRef.current = true;
                    onIntroComplete?.();
                }
            }
        }
    }, [camera, zones, onIntroComplete]);

    useFrame((state, delta) => {
        const speed = 1000; // Adjusted for visible pan animation

        // Cubic ease-in function: starts slow, then accelerates (only for intro)
        const easeIn = (t: number) => t * t * t;

        // Add subtle camera sway when idle
        const time = state.clock.elapsedTime;
        const swayAmount = 0.1; // Very subtle movement
        const swaySpeed = 0.5; // Slow oscillation
        const swayX = Math.sin(time * swaySpeed) * swayAmount;
        const swayY = Math.cos(time * swaySpeed * 0.7) * swayAmount;

        // Calculate target position with sway
        const targetWithSway = new Vector3(
            targetPos.current.x + swayX,
            targetPos.current.y + swayY,
            targetPos.current.z
        );

        // Calculate errors for both position and lookAt (using sway target)
        const posError = new Vector3().subVectors(targetWithSway, state.camera.position);
        const lookError = new Vector3().subVectors(targetLook.current, currentLook.current);
        const posDist = posError.length();
        const lookDist = lookError.length();

        // Use the maximum distance to synchronize both movements
        const maxDistance = Math.max(posDist, lookDist);
        const isMoving = maxDistance > 0.1; // Increased threshold to prevent sway from triggering movement

        if (isMoving) {
            let interpolationFactor: number;

            if (isIntroTransition) {
                // Ease-in for intro transition only
                const maxDist = 20;
                const progress = 1 - Math.min(maxDistance / maxDist, 1);
                const easedProgress = easeIn(progress);
                const easedSpeed = speed * (0.2 + easedProgress * 0.8);
                interpolationFactor = Math.min(1, (easedSpeed * delta) / maxDistance);
            } else {
                // Linear movement for normal navigation
                interpolationFactor = Math.min(1, (speed * delta) / maxDistance);
            }

            // Apply synchronized movement to position
            if (posDist > 0.01) {
                const posStep = posDist * interpolationFactor;
                state.camera.position.add(posError.normalize().multiplyScalar(posStep));
            } else {
                state.camera.position.copy(targetWithSway);
            }

            // Apply synchronized movement to lookAt
            if (lookDist > 0.01) {
                const lookStep = lookDist * interpolationFactor;
                currentLook.current.add(lookError.normalize().multiplyScalar(lookStep));
            } else {
                currentLook.current.copy(targetLook.current);
            }
        } else {
            // When idle, smoothly apply sway
            state.camera.position.copy(targetWithSway);
            currentLook.current.copy(targetLook.current);

            // Disable intro transition once we've reached the target
            if (isIntroTransition) {
                setIsIntroTransition(false);
                if (!introNotifiedRef.current) {
                    introNotifiedRef.current = true;
                    onIntroComplete?.();
                }
            }
        }

        state.camera.lookAt(currentLook.current);
    });

    return null;
}

function SceneAnimations({ scene }: { scene: Object3D }) {
    const windowMaterialsRef = useRef<MeshStandardMaterial[]>([]);
    const beaconMeshesRef = useRef<Mesh[]>([]);
    const redLightMaterialRef = useRef<Material | null>(null);
    const redLightOffMaterialRef = useRef<Material | null>(null);
    const beaconStateRef = useRef(false); // false = off, true = on
    const lastBeaconToggleRef = useRef(0);
    const flickerTimersRef = useRef<number[]>([]);

    // Find materials and meshes on mount
    useEffect(() => {
        const windowMaterials: MeshStandardMaterial[] = [];
        const beaconMeshes: Mesh[] = [];
        let redLight: Material | null = null;
        let redLightOff: Material | null = null;

        scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                const material = mesh.material as Material;

                // Find Windows_Flicker material
                if (material && material.name === 'Windows_Flicker') {
                    windowMaterials.push(material as MeshStandardMaterial);
                    console.log('✓ Found Windows_Flicker material');
                }

                // Find beacon meshes with red_light material
                if (material && material.name === 'red_light') {
                    beaconMeshes.push(mesh);
                    if (!redLight) redLight = material;
                    console.log('✓ Found beacon with red_light material');
                }

                // Find red_light_off material
                if (material && material.name === 'red_light_off') {
                    if (!redLightOff) redLightOff = material;
                    console.log('✓ Found red_light_off material');
                }
            }
        });

        windowMaterialsRef.current = windowMaterials;
        beaconMeshesRef.current = beaconMeshes;
        redLightMaterialRef.current = redLight;
        redLightOffMaterialRef.current = redLightOff;

        console.log(`Found ${windowMaterials.length} window materials and ${beaconMeshes.length} beacons`);

        // Initialize random flicker timers and states for each window material
        flickerTimersRef.current = windowMaterials.map(() => Math.random() * 3);
    }, [scene]);

    // Track flicker state for each window: 0 = normal, 1 = first blink, 2 = second blink
    const flickerStatesRef = useRef<number[]>([]);

    // Animate materials
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Window flicker animation - blink blink normal pattern
        windowMaterialsRef.current.forEach((material, index) => {
            if (material && material.emissive) {
                // Initialize state if needed
                if (!flickerStatesRef.current[index]) {
                    flickerStatesRef.current[index] = 0;
                }

                // Decrement timer
                flickerTimersRef.current[index] -= delta;

                // When timer expires, advance to next state
                if (flickerTimersRef.current[index] <= 0) {
                    const state = flickerStatesRef.current[index];

                    if (state === 0) {
                        // First blink - go dim
                        material.emissiveIntensity = 0.5;
                        flickerStatesRef.current[index] = 1;
                        flickerTimersRef.current[index] = 0.1; // Short delay
                    } else if (state === 1) {
                        // Back to normal briefly
                        material.emissiveIntensity = 10.0;
                        flickerStatesRef.current[index] = 2;
                        flickerTimersRef.current[index] = 0.1; // Short delay
                    } else if (state === 2) {
                        // Second blink - go dim again
                        material.emissiveIntensity = 0.5;
                        flickerStatesRef.current[index] = 3;
                        flickerTimersRef.current[index] = 0.1; // Short delay
                    } else {
                        // Return to normal and wait
                        material.emissiveIntensity = 10;
                        flickerStatesRef.current[index] = 0;
                        flickerTimersRef.current[index] = 2 + Math.random() * 8; // Wait 2-6 seconds
                    }
                }
            }
        });

        // Beacon light alternation (every 1 seconds)
        if (time - lastBeaconToggleRef.current > 1) {
            beaconStateRef.current = !beaconStateRef.current;
            lastBeaconToggleRef.current = time;

            // Toggle intensity between 10.0 and 0.5
            const intensity = beaconStateRef.current ? 10.0 : 0.5;

            if (redLightMaterialRef.current) {
                // Cast to any since we know it's a standard material with emissiveIntensity
                (redLightMaterialRef.current as any).emissiveIntensity = intensity;
            }
        }
    });

    return null;
}

function SceneModel({ onZonesExtracted, activeSection }: { onZonesExtracted: (zones: ZonesConfig) => void; activeSection: string }) {
    const { scene } = useGLTF('/models/scene.glb');

    const zones = useMemo(() => {
        const extractedZones: ZonesConfig = {};
        const sections = ['home', 'about', 'projects', 'experience', 'contact', 'start'];
        const colors = ['#D91C2B', '#ffe600', '#00ccff', '#ff4d00', '#ff00ff', '#ffffff'];

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

    return (
        <>
            <primitive object={scene} />
            <SceneAnimations scene={scene} />
            <BillboardContent sceneModel={scene} activeSection={activeSection} /> {/* Add this prop */}
            <EffectComposer multisampling={0}>
                <Bloom
                    intensity={0.6}
                    luminanceThreshold={0.8}
                    luminanceSmoothing={0.5}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    );
}

function StarrySky() {
    const pointsRef = useRef<any>(null);

    const positions = useMemo(() => {
        const starCount = 2000;
        const pos = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 2000;     // x
            pos[i + 1] = Math.random() * 1000;         // y
            pos[i + 2] = (Math.random() - 0.5) * 2000; // z
        }

        return pos;
    }, []);

    // Animate stars slowly
    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.01; // Very slow rotation
            pointsRef.current.rotation.x += delta * 0.005; // Even slower on X axis
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={1} color={0xffffff} />
        </points>
    );
}

export default function Scene({
    activeSection,
    onIntroComplete,
}: {
    activeSection: string;
    onIntroComplete?: () => void;
}) {
    const [zones, setZones] = useState<ZonesConfig>(DEFAULT_ZONES);

    const handleZonesExtracted = (newZones: ZonesConfig) => {
        setZones(newZones);
    };

    return (
        <div className="fixed inset-0 z-0 bg-neutral-900">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <fog attach="fog" args={['#1a1a1a', 50, 800]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="blue" />

                <CameraRig activeSection={activeSection} zones={zones} onIntroComplete={onIntroComplete} />

                <SceneModel onZonesExtracted={handleZonesExtracted} activeSection={activeSection} />
                <StarrySky />
            </Canvas>
        </div>
    );
}
