import * as THREE from "three";

export class CameraManager {
  constructor(width, height) {
    const fov = 75;
    const aspect = width / height;
    const near = 0.1;
    const far = 1000000;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.setInitialPosition();
  }

  //بيضبط موضع الكاميرا ولوين عم تتطلع
  setInitialPosition() {
    this.camera.position.z = 100;
    this.camera.position.y = 50;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  //لما بدي استعمل الكاميرا
  getCamera() {
    return this.camera;
  }

  /**
   * تقوم بتحديث نسبة العرض إلى الارتفاع للكاميرا عند تغيير حجم النافذة.
   * @param {number} width - العرض الجديد.
   * @param {number} height - الارتفاع الجديد.
   */
  updateAspectRatio(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix(); // يجب استدعاء هذه الدالة بعد تغيير أي خاصية للكاميرا
  }
}
