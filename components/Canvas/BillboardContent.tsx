'use client';

import { JSX, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CSS3DRenderer, CSS3DObject } from 'three-stdlib';
import { Object3D, Vector3, Quaternion, Euler, Box3, Mesh } from 'three';
import { createRoot } from 'react-dom/client';
import { HomeContent } from '../Billboards/HomeContent';
import { AboutContent } from '../Billboards/AboutContent';
import { ProjectsContent } from '../Billboards/ProjectsContent';
import { ExperienceContent } from '../Billboards/ExperienceContent';
import { ContactContent } from '../Billboards/ContactContent';

type BillboardContentProps = {
    sceneModel: Object3D;
    activeSection: string;
};

type BillboardData = {
    cssObject: CSS3DObject;
    element: HTMLDivElement;
    section: string;
    root: any;
};

export function BillboardContent({ sceneModel, activeSection }: BillboardContentProps) {
    const { gl, scene, camera, size } = useThree();
    const css3DRendererRef = useRef<CSS3DRenderer | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const billboardsRef = useRef<Map<string, BillboardData>>(new Map());
    const glitchAnimationsRef = useRef<Map<string, { startTime: number; type: 'in' | 'out' }>>(new Map());
    const previousSectionRef = useRef<string>(''); // Track previous section

    useEffect(() => {
        const container = document.createElement('div');
        container.id = 'css3d-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '10';
        document.body.appendChild(container);
        containerRef.current = container;

        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(size.width, size.height);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(cssRenderer.domElement);
        css3DRendererRef.current = cssRenderer;

        console.log('✅ CSS3D renderer created and appended to body');

        billboardsRef.current.forEach(({ cssObject, root }) => {
            scene.remove(cssObject);
            root.unmount();
        });
        billboardsRef.current.clear();

        const sections = ['Home', 'About', 'Projects', 'Experience', 'Contact'];

        sections.forEach((section) => {
            const billboardName = `Billboard_${section}`;
            let billboard: Object3D | undefined;

            sceneModel.traverse((child) => {
                if (child.name === billboardName) {
                    billboard = child;
                }
            });

            if (billboard) {
                const worldPos = new Vector3();
                const worldQuat = new Quaternion();

                billboard.updateWorldMatrix(true, true);
                const boundingBox = new Box3().setFromObject(billboard);
                boundingBox.getCenter(worldPos);
                billboard.getWorldQuaternion(worldQuat);

                const billboardSize = getBillboardSize(billboard);

                const baseWidth = 1600;
                const baseHeight = 1200;
                const billboardAspect = billboardSize.x / billboardSize.y;

                let htmlWidth = baseWidth;
                let htmlHeight = baseHeight;

                if (billboardAspect > htmlWidth / htmlHeight) {
                    htmlHeight = htmlWidth / billboardAspect;
                } else {
                    htmlWidth = htmlHeight * billboardAspect;
                }

                const element = document.createElement('div');
                element.className = `billboard-${section.toLowerCase()}`;
                element.style.width = `${htmlWidth}px`;
                element.style.height = `${htmlHeight}px`;
                element.style.color = 'white';
                // Components own their padding/fonts/layout
                // No backdropFilter — breaks Firefox preserve-3d compositing
                // No overflow:auto — Firefox CSS3D doesn't handle scroll inside preserve-3d
                element.style.overflow = 'hidden';
                element.style.pointerEvents = 'auto';
                element.style.boxSizing = 'border-box';
                element.style.cursor = 'default';
                const isInitialActive = section.toLowerCase() === activeSection.toLowerCase();
                element.style.opacity = isInitialActive ? '1' : '0';
                element.style.pointerEvents = isInitialActive ? 'auto' : 'none';

                const root = createRoot(element);
                root.render(getReactContentForSection(section));

                const cssObject = new CSS3DObject(element);
                cssObject.position.copy(worldPos);

                const correctionQuat = new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0));
                cssObject.quaternion.copy(worldQuat).multiply(correctionQuat);

                const scaleX = billboardSize.x / htmlWidth;
                const scaleY = billboardSize.y / htmlHeight;
                const scale = Math.max(scaleX, scaleY);

                cssObject.scale.set(scale, scale, scale);

                scene.add(cssObject);
                billboardsRef.current.set(section.toLowerCase(), {
                    cssObject,
                    element,
                    section: section.toLowerCase(),
                    root
                });

                console.log(`✅ Added CSS3D content for ${billboardName}`);
            }
        });

        // Ensure current active section billboard is visible immediately
        const activeBillboard = billboardsRef.current.get(activeSection.toLowerCase());
        if (activeBillboard) {
            activeBillboard.element.style.opacity = '1';
            activeBillboard.element.style.pointerEvents = 'auto';
        }

        return () => {
            billboardsRef.current.forEach(({ cssObject, root }) => {
                scene.remove(cssObject);
                root.unmount();
            });
            billboardsRef.current.clear();

            if (containerRef.current && containerRef.current.parentElement) {
                containerRef.current.parentElement.removeChild(containerRef.current);
            }

            css3DRendererRef.current = null;
            containerRef.current = null;
        };
    }, [sceneModel, gl, scene]);

    // Update billboard visibility with glitch trigger
    useEffect(() => {
        const currentSection = activeSection.toLowerCase();
        const previousSection = previousSectionRef.current;

        console.log(`👁️ Active section changed from "${previousSection}" to "${currentSection}"`);

        // Trigger glitch-out for previous section
        if (previousSection && previousSection !== currentSection) {
            const prevBillboard = billboardsRef.current.get(previousSection);
            if (prevBillboard) {
                glitchAnimationsRef.current.set(previousSection, {
                    startTime: performance.now(),
                    type: 'out'
                });
                prevBillboard.element.style.pointerEvents = 'none';
                console.log(`❌ Triggering glitch-out for ${previousSection}`);
            }
        }

        // Trigger glitch-in for current section
        const currentBillboard = billboardsRef.current.get(currentSection);
        if (currentBillboard) {
            glitchAnimationsRef.current.set(currentSection, {
                startTime: performance.now(),
                type: 'in'
            });
            currentBillboard.element.style.pointerEvents = 'auto';
            console.log(`✅ Triggering glitch-in for ${currentSection}`);
        }

        // Update previous section
        previousSectionRef.current = currentSection;
    }, [activeSection]);

    // Render loop with glitch animation
    useFrame(({ camera }) => {
        if (css3DRendererRef.current && containerRef.current) {
            const now = performance.now();

            // Process glitch animations
            glitchAnimationsRef.current.forEach((animation, section) => {
                const billboard = billboardsRef.current.get(section);
                if (!billboard) return;

                const elapsed = (now - animation.startTime) / 1000; // Convert to seconds
                const duration = 0.5; // 500ms glitch duration

                if (elapsed >= duration) {
                    // Animation complete
                    if (animation.type === 'in') {
                        billboard.element.style.opacity = '1';
                        billboard.element.style.filter = 'none';
                    } else {
                        billboard.element.style.opacity = '0';
                        billboard.element.style.filter = 'none';
                    }
                    glitchAnimationsRef.current.delete(section);
                } else {
                    // Animate glitch
                    const progress = elapsed / duration;
                    applyGlitchEffect(billboard.element, progress, animation.type);
                }
            });

            css3DRendererRef.current.render(scene, camera);
        }
    });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (css3DRendererRef.current) {
                css3DRendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return null;
}

// Glitch effect function
// Replace the applyGlitchEffect function with this safer wavy version:

function applyGlitchEffect(element: HTMLDivElement, progress: number, type: 'in' | 'out') {
    if (type === 'in') {
        // Fade in with wavy glitch
        const baseOpacity = progress;
        const blur = (1 - progress) * 4;
        const hue = Math.sin(progress * Math.PI * 8) * 180;
        const brightness = 1 + Math.sin(progress * Math.PI * 10) * 0.3;
        const contrast = 1 + Math.cos(progress * Math.PI * 6) * 0.4;
        const saturate = 1 + Math.sin(progress * Math.PI * 7) * 0.5;

        // Wavy opacity
        const waveOpacity = baseOpacity + Math.sin(progress * Math.PI * 15) * 0.2;
        element.style.opacity = `${Math.max(0, Math.min(1, waveOpacity))}`;

        // Complex filter with waves - NO TRANSFORM
        element.style.filter = `
            blur(${blur}px) 
            hue-rotate(${hue}deg) 
            brightness(${brightness}) 
            contrast(${contrast})
            saturate(${saturate})
        `;

        // Random glitch flicker (more frequent for wavy effect)
        if (Math.random() > 0.6) {
            element.style.opacity = `${Math.random() * 0.7}`;
            // Add random color shifts during flickers
            const randomHue = Math.random() * 360;
            element.style.filter = `
                blur(${blur}px) 
                hue-rotate(${randomHue}deg) 
                brightness(${1 + Math.random() * 0.5}) 
                contrast(${1 + Math.random() * 0.6})
                saturate(${1 + Math.random()})
            `;
        }
    } else {
        // Fade out with wavy glitch
        const baseOpacity = 1 - progress;
        const blur = progress * 6;
        const hue = Math.sin(progress * Math.PI * 8) * 180;
        const brightness = 1 + Math.sin(progress * Math.PI * 10) * 0.4;
        const contrast = 1 + Math.cos(progress * Math.PI * 6) * 0.5;
        const saturate = 1 + Math.sin(progress * Math.PI * 7) * 0.6;

        // Wavy opacity
        const waveOpacity = baseOpacity + Math.sin(progress * Math.PI * 15) * 0.15;
        element.style.opacity = `${Math.max(0, Math.min(1, waveOpacity))}`;

        // Complex filter with waves - NO TRANSFORM
        element.style.filter = `
            blur(${blur}px) 
            hue-rotate(${hue}deg) 
            brightness(${brightness}) 
            contrast(${contrast})
            saturate(${saturate})
        `;

        // Random glitch flicker (more frequent for wavy effect)
        if (Math.random() > 0.6) {
            element.style.opacity = `${Math.random() * 0.4}`;
            // Add random color shifts during flickers
            const randomHue = Math.random() * 360;
            element.style.filter = `
                blur(${blur}px) 
                hue-rotate(${randomHue}deg) 
                brightness(${1 + Math.random() * 0.5}) 
                contrast(${1 + Math.random() * 0.6})
                saturate(${1 + Math.random()})
            `;
        }
    }
}
// Helper function to calculate billboard size
function getBillboardSize(billboard: Object3D): Vector3 {
    let localSize = new Vector3();
    let meshCount = 0;
    const worldScale = new Vector3();
    billboard.getWorldScale(worldScale);

    billboard.traverse((child) => {
        if ((child as Mesh).isMesh) {
            meshCount++;
            const mesh = child as Mesh;

            if (mesh.geometry) {
                mesh.geometry.computeBoundingBox();
                if (mesh.geometry.boundingBox) {
                    const size = new Vector3();
                    mesh.geometry.boundingBox.getSize(size);

                    if (size.length() > localSize.length()) {
                        localSize = size;
                    }
                }
            }
        }
    });

    const actualWidth = localSize.z * Math.abs(worldScale.z);
    const actualHeight = localSize.y * Math.abs(worldScale.y);
    const thickness = localSize.x * Math.abs(worldScale.x);

    if (actualWidth < 0.1 || actualHeight < 0.1) {
        return new Vector3(10, 6, 1);
    }

    return new Vector3(actualWidth, actualHeight, thickness);
}

// Helper function to get React component for each section
function getReactContentForSection(section: string): JSX.Element {
    switch (section) {
        case 'Home':
            return <HomeContent />;
        case 'About':
            return <AboutContent />;
        case 'Projects':
            return <ProjectsContent />;
        case 'Experience':
            return <ExperienceContent />;
        case 'Contact':
            return <ContactContent />;
        default:
            return <div>Content not found</div>;
    }
}