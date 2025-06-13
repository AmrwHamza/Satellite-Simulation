import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  EARTH_RADIUS_METERS,
  METERS_TO_THREE_UNITS_FACTOR,
} from "../physics/constants";

export class ThreeSceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;

  constructor(containerElement: HTMLElement) {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x0a0a0a);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000000 * METERS_TO_THREE_UNITS_FACTOR
    );

    const cameraInitialDistance =
      EARTH_RADIUS_METERS * METERS_TO_THREE_UNITS_FACTOR * 4;
    this.camera.position.set(
      cameraInitialDistance,
      cameraInitialDistance,
      cameraInitialDistance
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    containerElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // زيادة الشدة
    directionalLight.position.set(1000, 1000, 1000).normalize(); // موضع بعيد وواضح
    this.scene.add(directionalLight);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    console.log("ThreeSceneManager initialized.");
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    console.log("Window resized. Renderer and camera adjusted.");
  }

  public updateControls(): void {
    this.controls.update();
  }

  public renderScene(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
