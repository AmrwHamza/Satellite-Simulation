// src/objects/satellite.ts

// هذا الكلاس يمثل القمر الصناعي في المحاكاة ككرة بسيطة.
// مسؤولياته:
// 1.  إنشاء شكل كروي للقمر الصناعي (بدلاً من تحميل نموذج GLB).
// 2.  تحديث موضع القمر الصناعي بناءً على بيانات الفيزياء.
// 3.  رسم خط المسار الذي يتبعه القمر الصناعي.

// نستورد الأدوات الأساسية من Three.js
import * as THREE from "three";

// نستورد الواجهات اللازمة لبيانات الفيزياء وحالة القمر الصناعي
import { IPhysicsState } from "../interfaces/IPhysicsState";

// نستورد الثوابت الفيزيائية، خاصة عامل التحويل
import { METERS_TO_THREE_UNITS_FACTOR } from "../physics/constants";
import { ISatelliteData } from "../interfaces/ISatelliteData";

/**
 * كلاس TrajectoryLine
 *
 * مسؤول عن رسم وتحديث خط مسار القمر الصناعي.
 */
class TrajectoryLine {
  public lineMesh: THREE.Line | null = null;
  private points: THREE.Vector3[] = [];
  private maxPoints: number = 2000; // الحد الأقصى للنقاط في المسار للحفاظ على الأداء

  /**
   * مُنشئ كلاس TrajectoryLine.
   */
  constructor() {
    // نُنشئ مادة الخط (لون أبيض بسيط).
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    // نُنشئ هندسة فارغة للخط (سيتم ملؤها بالنقاط لاحقاً).
    const geometry = new THREE.BufferGeometry();
    this.lineMesh = new THREE.Line(geometry, material);
    // نُعيّن موضع الخط بحيث لا يتأثر بموضع الكائن الرئيسي
    this.lineMesh.position.set(0, 0, 0);
  }

  /**
   * تُضيف نقطة جديدة إلى خط المسار.
   * @param position - الموضع الجديد للقمر الصناعي (بوحدات Three.js).
   */
  public addPoint(position: THREE.Vector3): void {
    this.points.push(position.clone()); // نُضيف نسخة من الموضع الحالي

    // إذا تجاوز عدد النقاط الحد الأقصى، نُزيل أقدم نقطة.
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    // نُحدّث نقاط الخط في الهندسة.
    if (this.lineMesh) {
      const positions = new Float32Array(this.points.length * 3); // كل نقطة لديها 3 إحداثيات (x, y, z)
      for (let i = 0; i < this.points.length; i++) {
        positions[i * 3] = this.points[i].x;
        positions[i * 3 + 1] = this.points[i].y;
        positions[i * 3 + 2] = this.points[i].z;
      }
      this.lineMesh.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      this.lineMesh.geometry.setDrawRange(0, this.points.length); // تحديد كم نقطة لرسمها
      this.lineMesh.geometry.attributes.position.needsUpdate = true; // إخبار Three.js بأن البيانات تغيرت
    }
  }

  /**
   * تُنظف (تُمسح) جميع النقاط من خط المسار.
   */
  public clear(): void {
    this.points = []; // نُمسح المصفوفة
    if (this.lineMesh && this.lineMesh.geometry.attributes.position) {
      this.lineMesh.geometry.setDrawRange(0, 0); // لا ترسم أي شيء
      this.lineMesh.geometry.attributes.position.needsUpdate = true;
    }
  }
}

/**
 * كلاس Satellite
 *
 * يمثل القمر الصناعي ككرة بسيطة في المشهد ثلاثي الأبعاد،
 * ويدير حالته الفيزيائية وخط مساره.
 */
export class Satellite {
  public mesh: THREE.Mesh | null = null;
  public trajectoryLine: TrajectoryLine;
  public physicsState: IPhysicsState;
  public isLoaded: boolean = false; // سيكون دائمًا صحيحًا لأننا لا نحمل شيئًا.

  private id: string;
  private name: string;

  /**
   * مُنشئ كلاس Satellite.
   * يقوم بإنشاء كرة بسيطة لتمثيل القمر الصناعي.
   *
   * @param initialData - البيانات الأولية للقمر الصناعي (المعرف، الاسم، الموضع، السرعة).
   */
  constructor(initialData: ISatelliteData) {
    this.id = initialData.id;
    this.name = initialData.name;

    // تهيئة الحالة الفيزيائية الأولية.
    this.physicsState = {
      position: initialData.initialPosition,
      velocity: initialData.initialVelocity,
    };

    console.log(
      `Satellite '${this.name}': Initializing satellite object (as a simple sphere)...`
    );

    // الخطوة 1: إنشاء هندسة كروية للقمر الصناعي.
    // نستخدم نصف قطر صغير جداً للقمر الصناعي (مثلاً 1000 متر = 1 كيلومتر في وحداتنا الحقيقية).
    // ثم نحولها إلى وحدات Three.js.
    const radius = 1000 * METERS_TO_THREE_UNITS_FACTOR; // 1 كيلومتر radius
    const geometry = new THREE.SphereGeometry(radius, 32, 32); // نصف القطر، عدد الشرائح

    // الخطوة 2: إنشاء مادة للقمر الصناعي (لون أبيض).
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // MeshBasicMaterial لا يتأثر بالإضاءة، جيد لكرات الاختبار

    // الخطوة 3: إنشاء الكائن ثلاثي الأبعاد (Mesh).
    this.mesh = new THREE.Mesh(geometry, material);

    // الخطوة 4: تهيئة خط المسار.
    this.trajectoryLine = new TrajectoryLine();

    this.isLoaded = true; // بما أننا لم نحمل شيئاً، الكائن جاهز فوراً.
    console.log(
      `Satellite '${this.name}': Simple sphere created with radius ${radius} Three.js units.`
    );

    // قم بتحديث الموضع المرئي الأول للقمر الصناعي.
    this.updateVisuals();
  }

  /**
   * يُحدّث الموضع المرئي للقمر الصناعي في المشهد.
   * يجب استدعاؤها بعد تحديث `physicsState.position` بواسطة محرك الفيزياء.
   */
  public updateVisuals(): void {
    if (this.mesh) {
      // نُحوّل الموضع من وحدات الفيزياء (المتر) إلى وحدات Three.js.
      const threeJsPosition = new THREE.Vector3(
        this.physicsState.position.x * METERS_TO_THREE_UNITS_FACTOR,
        this.physicsState.position.y * METERS_TO_THREE_UNITS_FACTOR,
        this.physicsState.position.z * METERS_TO_THREE_UNITS_FACTOR
      );
      this.mesh.position.copy(threeJsPosition); // نُحدّث موضع الكائن ثلاثي الأبعاد.

      // نُضيف الموضع الحالي إلى خط المسار.
      this.trajectoryLine.addPoint(threeJsPosition);
    }
  }

  /**
   * يُعيد تعيين القمر الصناعي إلى موضع وسرعة أوليين.
   * يُستخدم لإعادة تعيين المحاكاة.
   *
   * @param initialPosition - الموضع الأولي الجديد (بوحدات الفيزياء).
   * @param initialVelocity - السرعة الأولية الجديدة (بوحدات الفيزياء).
   */
  public reset(
    initialPosition: THREE.Vector3,
    initialVelocity: THREE.Vector3
  ): void {
    this.physicsState = {
      position: initialPosition.clone(),
      velocity: initialVelocity.clone(),
    };
    this.trajectoryLine.clear(); // نُمسح خط المسار عند إعادة التعيين.
    this.updateVisuals(); // نُحدّث الموضع المرئي للقمر.
    console.log(`Satellite '${this.name}': Reset to initial position.`);
  }

  // يمكن إضافة دوال أخرى هنا إذا احتجنا للوصول إلى خصائص القمر من الخارج.
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
