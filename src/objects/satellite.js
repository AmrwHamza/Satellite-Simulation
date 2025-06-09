import * as THREE from "three";
import { integrateRK4 } from "../physics/numericalIntegration.js";
import { VISUAL_SCALE } from "../physics/constants.js";

export class Satellite {
  constructor(initPos, initV, radius = 0.2, color = 0xff0000) {
    this.position = initialPosition.clone();
    this.velocity = initialVelocity.clone();

    const geometry = new THREE.SphereGeometry(radius, 32, 32); // كرة صغيرة للقمر الصناعي
    const material = new THREE.MeshPhongMaterial({ color: color });
    this.mesh = new THREE.Mesh(geometry, material);

    this.updateVisualPosition();
  }

  updateWithCustomIntegrator(deltaTime, integrateFunction) {
    // الخطوة 1: تحديث الخصائص الفيزيائية باستخدام دالة التكامل الممررة
    const newState = integrateFunction(this.position, this.velocity, deltaTime);
    this.position = newState.position;
    this.velocity = newState.velocity;

    // الخطوة 2: تحديث الموضع البصري للـ Mesh ليعكس الخصائص الفيزيائية الجديدة
    this.updateVisualPosition();
  }
  updateVisualPosition() {
    this.mesh.position.set(
      this.position.x / VISUAL_SCALE,
      this.position.y / VISUAL_SCALE,
      this.position.z / VISUAL_SCALE
    );
  }
  getMesh() {
    return this.mesh;
  }

  getPhysicsPosition() {
    return this.position;
  }

  getPhysicsVelocity() {
    return this.velocity;
  }
}
