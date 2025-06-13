// src/objects/earth.ts

// هذا الكلاس يمثل كوكب الأرض في المحاكاة ككرة بسيطة.
// مسؤولياته:
// 1.  إنشاء شكل كروي للأرض (بدلاً من تحميل نموذج GLB).
// 2.  تحديد حجم الأرض وموضعها.
// 3.  إدارة دوران الأرض حول محورها.

// نستورد الأدوات الأساسية من Three.js
import * as THREE from 'three';

// نستورد الثوابت الفيزيائية التي نحتاجها، مثل نصف قطر الأرض
import { EARTH_RADIUS_METERS, METERS_TO_THREE_UNITS_FACTOR } from '../physics/constants';

/**
 * كلاس Earth
 *
 * يمثل كوكب الأرض ككرة بسيطة في المشهد ثلاثي الأبعاد.
 * لا يقوم بتحميل نماذج GLB.
 */
export class Earth {
    // mesh: الكائن ثلاثي الأبعاد الذي يمثل الأرض في Three.js.
    // الآن سيكون من نوع Mesh (كرة) وليس Group.
    public mesh: THREE.Mesh | null = null;
    public isLoaded: boolean = false; // سيكون دائمًا صحيحًا لأننا لا نحمل شيئًا.

    // هذه المتغيرات لتحديد سرعة دوران الأرض (قابلة للتعديل).
    private rotationSpeed: number = 0.00007292115; // سرعة دوران الأرض (radian/second)

    /**
     * مُنشئ كلاس Earth.
     * يقوم بإنشاء كرة بسيطة لتمثيل الأرض.
     */
    constructor() {
        console.log("Earth: Initializing Earth object (as a simple sphere)...");

        // الخطوة 1: إنشاء هندسة كروية (SphereGeometry) للأرض.
        // نصف قطر الأرض في وحدات Three.js: (نحو 6371 كيلومتر = 6.371 * 10^6 متر)
        // Three.js يستخدم وحدة "مرنة" لتحديد الحجم.
        // لذا نستخدم عامل التحويل لتحويل المتر إلى وحدة Three.js.
        const radius = EARTH_RADIUS_METERS * METERS_TO_THREE_UNITS_FACTOR;
        const geometry = new THREE.SphereGeometry(radius, 64, 64); // نصف القطر، عدد الشرائح أفقياً وعمودياً (كلما زاد الرقم زادت النعومة)

        // الخطوة 2: إنشاء مادة (Material) للأرض.
        // MeshStandardMaterial تتفاعل مع الإضاءة.
        const material = new THREE.MeshStandardMaterial({
            color: 0x0000ff, // لون أزرق بسيط للأرض
            roughness: 0.8, // عامل الخشونة (يؤثر على طريقة انعكاس الضوء)
            metalness: 0.1  // عامل المعدنية (يؤثر على طريقة انعكاس الضوء)
        });

        // الخطوة 3: إنشاء الكائن ثلاثي الأبعاد (Mesh) ووضعه في الموضع (0,0,0).
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0); // نضع الأرض في مركز المشهد (0,0,0)

        this.isLoaded = true; // بما أننا لم نحمل شيئاً، الكائن جاهز فوراً.
        console.log(`Earth: Simple sphere created with radius ${radius} Three.js units.`);
    }

    /**
     * يُحدّث دوران الكرة الأرضية حول محورها.
     * @param deltaTime - الوقت المنقضي بالثواني منذ آخر تحديث.
     */
    public updateRotation(deltaTime: number): void {
        if (this.mesh) {
            // قم بتدوير الأرض حول المحور Y (للدوران حول القطبين).
            this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        }
    }
}