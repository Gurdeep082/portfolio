import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Create star geometry
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 11000;
    const starPositions = new Float32Array(starCount * 3);

    // Random positions for stars
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 2000; // star spread
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    // Star material
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
    });

    // Create star points
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Set camera position
    camera.position.z = 800;

    // Animate stars
    const animateStars = () => {
      requestAnimationFrame(animateStars);

      // Rotate stars
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0002;

      // Update star positions to simulate movement towards the camera
      const positions = stars.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.05; // Move stars downward

        // Reset star position if it moves out of bounds
        if (positions[i + 1] < -1000) {
          positions[i + 1] = 1000;
        }
      }
      stars.geometry.attributes.position.needsUpdate = true;

      // Render the scene
      renderer.render(scene, camera);
    };

    // Window resize handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    animateStars();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={canvasRef} style={canvasStyle} />;
};

// CSS styles for the canvas to ensure it covers the entire window and stays behind other elements
const canvasStyle = {
  position: "fixed", // Fixed position to cover the entire window
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -1, // Ensure it's in the background
};

export default SpaceBackground;
