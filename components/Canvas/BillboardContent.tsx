'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CSS3DRenderer, CSS3DObject } from 'three-stdlib';
import { Object3D, Vector3, Quaternion, Euler, Box3, Mesh } from 'three';

type BillboardContentProps = {
    sceneModel: Object3D;
    activeSection: string;
};

type BillboardData = {
    cssObject: CSS3DObject;
    element: HTMLDivElement;
    section: string;
};

export function BillboardContent({ sceneModel, activeSection }: BillboardContentProps) {
    const { gl, scene, camera, size } = useThree();
    const css3DRendererRef = useRef<CSS3DRenderer | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const billboardsRef = useRef<Map<string, BillboardData>>(new Map());

    useEffect(() => {
        // Create container for CSS3D renderer
        const container = document.createElement('div');
        container.id = 'css3d-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        containerRef.current = container;

        // Create CSS3D renderer
        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(size.width, size.height);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(cssRenderer.domElement);
        css3DRendererRef.current = cssRenderer;

        console.log('✅ CSS3D renderer created and appended to body');

        // Clear any existing CSS3D objects
        billboardsRef.current.forEach(({ cssObject }) => scene.remove(cssObject));
        billboardsRef.current.clear();

        // Find and create billboards
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

                // Get world transform
                billboard.updateWorldMatrix(true, false);
                billboard.getWorldPosition(worldPos);
                billboard.getWorldQuaternion(worldQuat);

                // Calculate billboard size
                const billboardSize = getBillboardSize(billboard);
                console.log(`📐 ${billboardName} size:`, billboardSize);

                // Use a fixed base size for consistency, then scale based on billboard
                const baseWidth = 1600;
                const baseHeight = 1200;

                // Calculate aspect ratio of the billboard
                const billboardAspect = billboardSize.x / billboardSize.y;

                // Adjust HTML dimensions to match billboard aspect ratio
                let htmlWidth = baseWidth;
                let htmlHeight = baseHeight;

                if (billboardAspect > htmlWidth / htmlHeight) {
                    // Billboard is wider
                    htmlHeight = htmlWidth / billboardAspect;
                } else {
                    // Billboard is taller
                    htmlWidth = htmlHeight * billboardAspect;
                }

                console.log(`📏 ${billboardName} HTML size: ${htmlWidth.toFixed(0)}x${htmlHeight.toFixed(0)}px`);

                // Create HTML content
                const element = document.createElement('div');
                element.className = `billboard-${section.toLowerCase()}`;
                element.style.width = `${htmlWidth}px`;
                element.style.height = `${htmlHeight}px`;
                element.style.background = 'rgba(10, 10, 20, 0.95)';
                element.style.backdropFilter = 'blur(10px)';
                element.style.color = 'white';
                element.style.padding = '40px';
                element.style.fontSize = '24px'; // Increased from 18px
                element.style.fontFamily = 'system-ui, -apple-system, sans-serif';
                element.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                element.style.borderRadius = '12px';
                element.style.pointerEvents = 'auto';
                element.style.overflow = 'auto';
                element.style.boxSizing = 'border-box';
                element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                element.style.cursor = 'default';
                element.style.opacity = '0'; // Start hidden
                element.style.transition = 'opacity 0.5s ease-in-out';

                // Create content based on section
                element.innerHTML = getContentForSection(section);

                // Create CSS3D object
                const cssObject = new CSS3DObject(element);

                // Apply the billboard's world position
                cssObject.position.copy(worldPos);

                // Rotation correction to face +X
                const correctionQuat = new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0));
                cssObject.quaternion.copy(worldQuat).multiply(correctionQuat);

                // Calculate scale to fit the billboard
                // We want the larger dimension of the billboard to match
                const scaleX = billboardSize.x / htmlWidth;
                const scaleY = billboardSize.y / htmlHeight;
                const scale = Math.max(scaleX, scaleY); // Use the larger scale to ensure it fits

                cssObject.scale.set(scale, scale, scale);

                scene.add(cssObject);
                billboardsRef.current.set(section.toLowerCase(), {
                    cssObject,
                    element,
                    section: section.toLowerCase()
                });

                console.log(`✅ Added CSS3D content for ${billboardName} with scale: ${scale.toFixed(4)}`);
            } else {
                console.warn(`⚠️ Billboard not found: ${billboardName}`);
            }
        });

        console.log(`Total CSS3D objects created: ${billboardsRef.current.size}`);

        // Cleanup function
        return () => {
            billboardsRef.current.forEach(({ cssObject }) => scene.remove(cssObject));
            billboardsRef.current.clear();

            if (containerRef.current && containerRef.current.parentElement) {
                containerRef.current.parentElement.removeChild(containerRef.current);
            }

            css3DRendererRef.current = null;
            containerRef.current = null;
        };
    }, [sceneModel, gl, scene, size]);

    // Update billboard visibility based on active section
    useEffect(() => {
        console.log(`👁️ Active section changed to: ${activeSection}`);

        billboardsRef.current.forEach(({ element, section }) => {
            if (section === activeSection.toLowerCase()) {
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
                console.log(`✅ Showing ${section} billboard`);
            } else {
                element.style.opacity = '0';
                element.style.pointerEvents = 'none';
                console.log(`❌ Hiding ${section} billboard`);
            }
        });
    }, [activeSection]);

    // Render loop
    useFrame(({ camera }) => {
        if (css3DRendererRef.current && containerRef.current) {
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

function getBillboardSize(billboard: Object3D): Vector3 {
    console.log(`🔍 Analyzing billboard:`, billboard.name);

    let localSize = new Vector3();
    let meshCount = 0;

    billboard.traverse((child) => {
        if ((child as Mesh).isMesh) {
            meshCount++;
            const mesh = child as Mesh;

            if (mesh.geometry) {
                mesh.geometry.computeBoundingBox();
                if (mesh.geometry.boundingBox) {
                    // Use LOCAL geometry size, not world transformed size
                    const size = new Vector3();
                    mesh.geometry.boundingBox.getSize(size);

                    // Keep the largest bounding box if there are multiple meshes
                    if (size.length() > localSize.length()) {
                        localSize = size;
                    }
                }
            }
        }
    });

    console.log(`   Total meshes found:`, meshCount);
    console.log(`   📊 Local geometry size (X, Y, Z):`, localSize.x.toFixed(2), localSize.y.toFixed(2), localSize.z.toFixed(2));

    // For glTF export: Blender Y → Three.js Z, Blender Z → Three.js Y
    // So: width = Z (Blender's Y), height = Y (Blender's Z)
    const actualWidth = localSize.z;   // Blender's Y
    const actualHeight = localSize.y;  // Blender's Z
    const thickness = localSize.x;     // Blender's X

    console.log(`   ✅ Billboard dimensions: width (Z)=${actualWidth.toFixed(2)}, height (Y)=${actualHeight.toFixed(2)}, thickness (X)=${thickness.toFixed(2)}`);

    // Check if dimensions are valid
    if (actualWidth < 0.1 || actualHeight < 0.1) {
        console.warn(`⚠️ Billboard ${billboard.name} size too small (width=${actualWidth.toFixed(2)}, height=${actualHeight.toFixed(2)}), using default`);
        return new Vector3(10, 6, 1);
    }

    // Return with width as X and height as Y for our calculations
    return new Vector3(actualWidth, actualHeight, thickness);
}

// Helper function to generate content for each section
function getContentForSection(section: string): string {
    const baseButtonStyle = `
    padding: 16px 32px;
    font-size: 22px;
    cursor: pointer;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    margin-top: 20px;
    transition: transform 0.2s;
    font-weight: 600;
  `;

    const headingStyle = `
    margin: 0 0 24px 0;
    font-size: 64px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `;

    switch (section) {
        case 'Home':
            return `
        <h1 style="${headingStyle}">Welcome</h1>
        <p style="font-size: 28px; line-height: 1.6; margin-bottom: 16px;">
          Hi, I'm a creative developer passionate about building immersive web experiences.
        </p>
        <p style="font-size: 22px; line-height: 1.6; opacity: 0.8;">
          Explore my work and let's create something amazing together.
        </p>
        <button 
          style="${baseButtonStyle}" 
          onmouseover="this.style.transform='scale(1.05)'" 
          onmouseout="this.style.transform='scale(1)'"
          onclick="alert('Button clicked! You can add your custom logic here.');"
        >
          Get Started
        </button>
      `;

        case 'About':
            return `
        <h1 style="${headingStyle}">About Me</h1>
        <p style="font-size: 24px; line-height: 1.6; margin-bottom: 16px;">
          I specialize in Three.js, React, and creative coding.
        </p>
        <ul style="font-size: 22px; line-height: 1.8; opacity: 0.9;">
          <li>🎨 Creative Development</li>
          <li>🚀 WebGL & Three.js</li>
          <li>⚡ React & Next.js</li>
          <li>🎯 Interactive Experiences</li>
        </ul>
        <button 
          style="${baseButtonStyle}" 
          onmouseover="this.style.transform='scale(1.05)'" 
          onmouseout="this.style.transform='scale(1)'"
          onclick="alert('Download Resume clicked!')"
        >
          Download Resume
        </button>
      `;

        case 'Projects':
            return `
        <h1 style="${headingStyle}">Projects</h1>
        <div style="display: grid; gap: 16px; max-height: calc(100% - 250px); overflow-y: auto;">
          <div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; transition: background 0.2s;" 
               onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
               onmouseout="this.style.background='rgba(255,255,255,0.05)'"
               onclick="alert('Project 1 clicked!')">
            <h3 style="margin: 0 0 8px 0; font-size: 28px;">3D Portfolio</h3>
            <p style="font-size: 20px; opacity: 0.8;">Interactive 3D experience built with Three.js</p>
          </div>
          <div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; transition: background 0.2s;" 
               onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
               onmouseout="this.style.background='rgba(255,255,255,0.05)'"
               onclick="alert('Project 2 clicked!')">
            <h3 style="margin: 0 0 8px 0; font-size: 28px;">WebGL Game</h3>
            <p style="font-size: 20px; opacity: 0.8;">Multiplayer browser game with real-time physics</p>
          </div>
        </div>
        <button 
          style="${baseButtonStyle}" 
          onmouseover="this.style.transform='scale(1.05)'" 
          onmouseout="this.style.transform='scale(1)'"
          onclick="alert('View All Projects clicked!')"
        >
          View All Projects
        </button>
      `;

        case 'Experience':
            return `
        <h1 style="${headingStyle}">Experience</h1>
        <div style="display: grid; gap: 24px; max-height: calc(100% - 200px); overflow-y: auto;">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 32px;">Senior Frontend Developer</h3>
            <p style="font-size: 18px; opacity: 0.6; margin: 0 0 12px 0;">Company Name • 2022 - Present</p>
            <p style="font-size: 22px; line-height: 1.6; opacity: 0.9;">
              Leading development of interactive 3D web experiences and WebGL applications.
            </p>
          </div>
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 32px;">Creative Developer</h3>
            <p style="font-size: 18px; opacity: 0.6; margin: 0 0 12px 0;">Agency • 2020 - 2022</p>
            <p style="font-size: 22px; line-height: 1.6; opacity: 0.9;">
              Built award-winning interactive campaigns for major brands.
            </p>
          </div>
        </div>
      `;

        case 'Contact':
            return `
        <h1 style="${headingStyle}">Get In Touch</h1>
        <p style="font-size: 26px; line-height: 1.6; margin-bottom: 24px;">
          Let's collaborate on your next project!
        </p>
        <div style="display: grid; gap: 16px; margin-bottom: 24px;">
          <a href="mailto:hello@example.com" style="color: #667eea; text-decoration: none; font-size: 22px; cursor: pointer;">
            📧 hello@example.com
          </a>
          <a href="https://twitter.com" target="_blank" style="color: #667eea; text-decoration: none; font-size: 22px; cursor: pointer;">
            🐦 @yourhandle
          </a>
          <a href="https://github.com" target="_blank" style="color: #667eea; text-decoration: none; font-size: 22px; cursor: pointer;">
            💻 github.com/yourusername
          </a>
        </div>
        <button 
          style="${baseButtonStyle}" 
          onmouseover="this.style.transform='scale(1.05)'" 
          onmouseout="this.style.transform='scale(1)'"
          onclick="alert('Send Message clicked!')"
        >
          Send Message
        </button>
      `;

        default:
            return `<h1 style="${headingStyle}">${section}</h1>`;
    }
}