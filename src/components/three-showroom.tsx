"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeShowroom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.35, 7.6);

    const showroom = new THREE.Group();
    scene.add(showroom);

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const key = new THREE.SpotLight(0xfff4d0, 4.4, 18, Math.PI / 6, 0.8, 1.2);
    key.position.set(-2.8, 4.6, 3.8);
    scene.add(key);

    const rim = new THREE.PointLight(0xffd65a, 3.2, 12);
    rim.position.set(3.4, 1.6, 2.8);
    scene.add(rim);

    const lower = new THREE.PointLight(0xffffff, 1.6, 10);
    lower.position.set(0, -2.1, 2.8);
    scene.add(lower);

    const acrylicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.02,
      metalness: 0,
      transmission: 0.88,
      thickness: 0.8,
      reflectivity: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      side: THREE.DoubleSide
    });

    const caseBody = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.92, 2.18), acrylicMaterial);
    caseBody.position.y = 0.08;
    showroom.add(caseBody);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffd65a,
      transparent: true,
      opacity: 0.64
    });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.48, 2.98, 2.24)),
      edgeMaterial
    );
    edges.position.y = 0.08;
    showroom.add(edges);

    const lidMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd65a,
      roughness: 0.26,
      metalness: 0.72
    });

    const leftCap = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.06, 2.32), lidMaterial);
    leftCap.position.set(-2.34, 0.08, 0);
    const rightCap = leftCap.clone();
    rightCap.position.x = 2.34;
    showroom.add(leftCap, rightCap);

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(2.75, 3.18, 0.18, 96),
      new THREE.MeshStandardMaterial({
        color: 0x143a29,
        roughness: 0.32,
        metalness: 0.5
      })
    );
    plinth.position.y = -1.78;
    showroom.add(plinth);

    const productGroup = new THREE.Group();
    showroom.add(productGroup);

    const etb = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 1.55, 0.68),
      new THREE.MeshStandardMaterial({
        color: 0x143a29,
        roughness: 0.34,
        metalness: 0.15
      })
    );
    etb.position.set(-0.82, -0.06, 0.06);
    productGroup.add(etb);

    const etbBand = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.12, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0xffb38a,
        roughness: 0.22,
        metalness: 0.62
      })
    );
    etbBand.position.set(-0.82, 0.45, 0.07);
    productGroup.add(etbBand);

    const booster = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.82, 0.72),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.08
      })
    );
    booster.position.set(0.72, -0.42, 0);
    productGroup.add(booster);

    const boosterStripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 0.08, 0.75),
      new THREE.MeshStandardMaterial({
        color: 0x44a7d8,
        roughness: 0.26,
        metalness: 0.7
      })
    );
    boosterStripe.position.set(0.72, -0.1, 0.02);
    productGroup.add(boosterStripe);

    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 1.24, 0.08),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.46,
        roughness: 0.06,
        transmission: 0.58,
        thickness: 0.2
      })
    );
    slab.position.set(1.44, -0.12, 0.32);
    slab.rotation.y = -0.18;
    productGroup.add(slab);

    const slabLabel = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.18, 0.085),
      new THREE.MeshStandardMaterial({ color: 0xffd65a, roughness: 0.3, metalness: 0.5 })
    );
    slabLabel.position.set(1.44, 0.4, 0.325);
    slabLabel.rotation.y = -0.18;
    productGroup.add(slabLabel);

    const floorRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.28, 0.012, 12, 160),
      new THREE.MeshStandardMaterial({
        color: 0xffd65a,
        roughness: 0.16,
        metalness: 0.9,
        emissive: 0x2f8f5b,
        emissiveIntensity: 0.18
      })
    );
    floorRing.position.y = -1.58;
    floorRing.rotation.x = Math.PI / 2;
    showroom.add(floorRing);

    const pointer = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    let frameId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const render = () => {
      const elapsed = clock.getElapsedTime();
      productGroup.rotation.y = elapsed * 0.32;
      showroom.rotation.y += ((pointer.x * 0.18 + Math.sin(elapsed * 0.28) * 0.035) - showroom.rotation.y) * 0.045;
      showroom.rotation.x += ((-pointer.y * 0.08) - showroom.rotation.x) * 0.045;
      caseBody.position.y = 0.08 + Math.sin(elapsed * 0.9) * 0.035;
      edges.position.y = caseBody.position.y;
      leftCap.position.y = caseBody.position.y;
      rightCap.position.y = caseBody.position.y;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full min-h-[560px] w-full touch-none sm:min-h-[680px] lg:min-h-[760px]"
      aria-label="Floating acrylic display case with premium collector products"
    />
  );
}
