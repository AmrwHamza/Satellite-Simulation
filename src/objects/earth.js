import * as THREE from "three";

export class Earth {
  constructor() {
    const geometry = new THREE.SphereGeometry(EARTH_VISUAL_RADIUS, 64, 64);

    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, // لون أزرق بسيط للأرض في البداية
      shininess: 10, // لخاصية اللمعان
    });

    // الجسم بال THREE js بدو  geometry و material
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 0);
    // رح نحط ال الارض ب 000 منشان تسهيل القياسات تبع r
  }


      getMesh() {
        return this.mesh;
    }

// update() {
//اذا حبينا ندور الارض 

//     }

}
