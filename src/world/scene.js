import * as THREE from "three";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.addLights();
  }
  //هون منعدل اضاءة الم
  addLights() {
    //ضوء عام خفيف
    const ambientLight = new THREE.AmbientLight(0x404040);

    this.scene.add(ambientLight);
    //  لمحاكاة ضوء الشمس
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5); // يمكن تغيير هذا لتغيير اتجاه الظلال
    this.scene.add(directionalLight);
  }
  //ها التابع لما بدي استدعي المشهد
  getScene() {
    return this.scene;
  }
  // ها الدالة بترجع المشهد لما مثلا احتاج ضيف شي على المشهد
  addObject(object) {
    this.scene.add(object);
  }
  removeObject(object) {
    this.scene.remove(object);
  }
}
