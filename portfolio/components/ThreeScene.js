import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const touchTime = 200;

const ThreeScene = () => {
  const mountRef = useRef(null);
  const router = useRouter(); // Use Next.js router for navigation
  const objects = useRef([]); // Store clickable objects
  const initialCameraPosition = useRef([
    0,
    0,
    5, // Default camera position
  ]);
  const touchStart = useRef(Date.now());

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(...initialCameraPosition.current);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a200e,
      metalness: 0,
      roughness: 1,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-2, 0, 0);
    scene.add(cube);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.01);
    const light = new THREE.PointLight();
    const lightprobe = new THREE.PointLightHelper(light);

    light.position.set(2, 2, 2);
    light.intensity = 100;

    scene.add(light);
    scene.add(lightprobe);
    scene.add(ambient);

    cube.userData.link = "/photography";
    objects.current.push(cube);

    // Mouse movement variables
    let mouseX = 0;
    let mouseY = 0;

    // Raycaster and mouse vector
    const raycaster = new THREE.Raycaster();

    // Handle mouse click
    const handleMouseClick = (event) => {
      // Update the raycaster
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

      // Check for intersections
      const intersects = raycaster.intersectObjects(objects.current);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const link = clickedObject.userData.link;

        if (link) {
          // Smoothly move the camera to the clicked object
          gsap.to(camera.position, {
            x: clickedObject.position.x,
            y: clickedObject.position.y,
            z: camera.position.z - 2, // Zoom in slightly
            duration: 1,
            onComplete: () => {
              router.push(link); // Redirect after animation
            },
          });
        }
      }
    };

    // Add event listener for mouse clicks
    window.addEventListener("click", handleMouseClick);

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to -1 to 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize to -1 to 1

      raycaster.setFromCamera({ x: 0, y: 0 }, camera);
      const intersects = raycaster.intersectObjects(objects.current);

      objects.current.forEach((object) => {
        object.material.emissive = new THREE.Color("black");
      });

      if (intersects.length > 0) {
        intersects[0].object.material.emissive = new THREE.Color("green");
        router.prefetch(intersects[0].object.userData.link);
      }
    };

    // Add event listener for mouse move
    window.addEventListener("mousemove", handleMouseMove);

    const handleTouchStart = (event) => {
      event.preventDefault();
      if (event.changedTouches.length === 1) {
        touchStart.current = Date.now();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);

    const handleTouchMove = (event) => {
      event.preventDefault();
      if (Date.now() - touchStart.current > touchTime) {
        let touch = event.targetTouches[event.targetTouches.length - 1];

        mouseX = (touch.clientX / window.innerWidth) * 2 - 1; // Normalize to -1 to 1
        mouseY = -(touch.clientY / window.innerHeight) * 2 + 1; // Normalize to -1 to 1

        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        const intersects = raycaster.intersectObjects(objects.current);

        objects.current.forEach((object) => {
          object.material.emissive = new THREE.Color("black");
        });

        if (intersects.length > 0) {
          intersects[0].object.material.emissive = new THREE.Color("green");
          router.prefetch(intersects[0].object.userData.link);
        }
      }
    };

    window.addEventListener("touchmove", handleTouchMove);

    const handleTouchEnd = (event) => {
      event.preventDefault();
      if (Date.now() - touchStart.current <= touchTime) {
        handleMouseClick();
      }
      touchStart.current = Date.now();
    };

    window.addEventListener("touchend", handleTouchEnd);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      camera.rotation.x = mouseY * -0.5; // Adjust the multiplier for sensitivity
      camera.rotation.y = mouseX * 0.5; // Adjust the multiplier for sensitivity

      // Render the scene
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose(); // Dispose renderer
      geometry.dispose(); // Dispose geometry
      material.dispose(); // Dispose material
      scene.clear(); // Clear scene objects
    };
  }, [router]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={mountRef} className="canvas-container"></div>
      <div className="crosshair"></div>
    </div>
  );
};

export default ThreeScene;
