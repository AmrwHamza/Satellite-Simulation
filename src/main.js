import * as THREE from "three";
import { SceneManager } from "./world/scene";
import { CameraManager } from "./world/camera";
import { RendererManager } from "./world/renderer";

let sceneManager;
let cameraManager;
let rendererManager;

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  sceneManager = new SceneManager();
  cameraManager = new CameraManager(width, height);
  rendererManager = new RendererManager(width, height);

  window.addEventListener("resize", onWindowResize);

  animate();
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  cameraManager.updateAspectRatio(width, height); // تحديث الكاميرا
  rendererManager.updateSize(width, height); // تحديث العارض
}

function animate() {
  requestAnimationFrame(animate); // تطلب من المتصفح استدعاء animate في الإطار التالي المتاح

  rendererManager.render(sceneManager.getScene(), cameraManager.getCamera());
}

document.addEventListener("DOMContentLoaded", init);
