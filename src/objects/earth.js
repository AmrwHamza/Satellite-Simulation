// src/objects/Earth.js

// رسالة الملف: يمثل كائن الأرض في المحاكاة، ويدير تمثيله البصري ودورانه.

import * as THREE from 'three';
// استيراد الثابت بالاسم الصحيح
import { EARTH_RADIUS_VISUAL } from '../physics/constants.js'; // <--- تم التعديل هنا

/**
 * فئة Earth: تمثل كوكب الأرض في المحاكاة.
 * مسؤولة عن إنشاء تمثيلها البصري (كرة Three.js Mesh) ودورانها.
 */
export class Earth {
    constructor() {
        this.mesh = this.createVisualMesh(EARTH_RADIUS_VISUAL);
    }

    /**
     * ينشئ التمثيل البصري للأرض كـ THREE.Mesh.
     * @param {number} radius - نصف قطر الكرة البصرية للأرض.
     * @returns {THREE.Mesh} - كائن Mesh يمثل الأرض.
     */
    createVisualMesh(radius) {
        // يمكن استخدام خريطة نسيج (texture map) لجعل الأرض تبدو واقعية أكثر
        // على سبيل المثال: const textureLoader = new THREE.TextureLoader();
        // const earthTexture = textureLoader.load('path/to/earth_texture.jpg');
        // const material = new THREE.MeshPhongMaterial({ map: earthTexture });

        const geometry = new THREE.SphereGeometry(radius, 64, 64); // كرة كبيرة ومفصلة
        const material = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // لون أزرق بسيط حالياً
        const earthMesh = new THREE.Mesh(geometry, material);

        // وضع الأرض في مركز الإحداثيات
        earthMesh.position.set(0, 0, 0);

        return earthMesh;
    }

    /**
     * يحدث حالة الأرض في كل إطار (على سبيل المثال، دورانها).
     * @param {number} deltaTime - الخطوة الزمنية بالثواني.
     */
    update(deltaTime) {
        // مثال على الدوران: تدور الأرض حول محور Y بمعدل ثابت
        // 0.0001 راديان في كل خطوة زمنية، يمكن تعديل هذه القيمة
        this.mesh.rotation.y += 0.0001 * deltaTime * 60; // 60 لزيادة السرعة قليلاً للرؤية
    }

    /**
     * يعيد كائن Three.js Mesh الذي يمثل الأرض بصرياً.
     * @returns {THREE.Mesh} - كائن Mesh.
     */
    getMesh() {
        return this.mesh;
    }
}