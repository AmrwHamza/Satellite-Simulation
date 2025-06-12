import { Mesh } from "three";
import {
  EARTH_RADIUS_METERS,
  METERS_TO_THREE_UNITS_FACTOR,
} from "../physics/constants";
import { SphereGeometry } from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Earth {
  public mesh: Object3D | null = null;
  public isLoaded: boolean = false;

  constructor() {
    const earthRadiusThreeUnits =
      EARTH_RADIUS_METERS * METERS_TO_THREE_UNITS_FACTOR;
    console.log(`Earth radius in Three.js units: ${earthRadiusThreeUnits}`);
    const loader = new GLTFLoader();

    loader.load(
      "/assets/models/earth.glb", // مسار ملف GLB، يجب أن يكون في مجلد public/assets/models
      (gltf) => {
        this.mesh = gltf.scene;

        this.mesh.position.set(0, 0, 0);

        console.log("Earth model loaded successfully!", this.mesh);
        this.isLoaded = true; // نحدد أن النموذج تم تحميله بنجاح
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // دالة يتم استدعاؤها عند حدوث خطأ في التحميل.
      (error) => {
        console.error(
          "An error occurred while loading the Earth model:",
          error
        );
      }
    );
  }

  updateRotation(deltaTime: number): void {
    if (!this.mesh) {
      return;
    }

    const rotationSpeedRadPerSecond = (2 * Math.PI) / 86164;

    this.mesh.rotation.y += rotationSpeedRadPerSecond * deltaTime;
  }
}
