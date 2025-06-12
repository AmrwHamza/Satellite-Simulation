// src/objects/Satellite.js

import * as THREE from "three";
import { VISUAL_SCALE_FACTOR, SATELLITE_RADIUS_VISUAL, EARTH_RADIUS_METERS } from "../physics/constants.js";

// حد أقصى لعدد النقاط في المسار. يساعد على عدم استهلاك الذاكرة بشكل كبير.
const MAX_TRAIL_POINTS = 500;

/**
 * فئة Satellite: تمثل قمراً صناعياً في المحاكاة.
 * هذه الفئة تجمع بين:
 * 1. الحالة الفيزيائية: الموضع والسرعة (بالمتر).
 * 2. التمثيل البصري: كائن THREE.Mesh (الكرة التي تراها).
 * 3. تتبع المسار: الخط الذي يرسمه القمر خلفه.
 * 4. القدرة على التحديث: استخدام دالة تكامل لحساب حركته.
 */
export class Satellite {
    /**
     * يقوم بإنشاء قمر صناعي جديد.
     * @param {THREE.Vector3} initialPosition - الموضع الأولي للقمر الصناعي بالوحدات الفيزيائية (متر).
     * @param {THREE.Vector3} initialVelocity - السرعة الأولية للقمر الصناعي بالوحدات الفيزيائية (متر/ثانية).
     * @param {number} radiusVisual - نصف قطر القمر الصناعي في وحدات Three.js البصرية (عادة صغير جداً).
     */
    constructor(
        initialPosition,
        initialVelocity,
        radiusVisual = SATELLITE_RADIUS_VISUAL
    ) {
        // --- 1. الخصائص الفيزيائية ---
        this.position = initialPosition.clone();
        this.velocity = initialVelocity.clone();

        // --- 2. التمثيل البصري (شكل الكرة) ---
        this.mesh = this.createVisualMesh(radiusVisual);
        this.updateVisualPosition();

        // --- 3. تتبع المسار ---
        this.trailPoints = [];
        this.trailGeom = new THREE.BufferGeometry();
        this.trailLine = new THREE.Line(
            this.trailGeom,
            new THREE.LineBasicMaterial({ color: 0xffffff }) // لون المسار: أبيض
        );
        // لا نضيف المسار للمشهد هنا، بل في main.js
    }

    /**
     * ينشئ كائن Mesh لتمثيل القمر الصناعي بصرياً.
     * @param {number} radiusVisual - نصف قطر الكرة البصري.
     * @returns {THREE.Mesh} - كائن Mesh يمثل القمر الصناعي.
     */
    createVisualMesh(radiusVisual) {
        const geometry = new THREE.SphereGeometry(radiusVisual, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // لون أحمر للقمر الصناعي
        return new THREE.Mesh(geometry, material);
    }

    /**
     * يحدّث موضع كائن Mesh البصري بناءً على الموضع الفيزيائي.
     * يتم تحويل الموضع من الوحدات الفيزيائية (متر) إلى وحدات Three.js البصرية باستخدام VISUAL_SCALE_FACTOR.
     */
    updateVisualPosition() {
        this.mesh.position.set(
            this.position.x / VISUAL_SCALE_FACTOR,
            this.position.y / VISUAL_SCALE_FACTOR,
            this.position.z / VISUAL_SCALE_FACTOR
        );
    }

    /**
     * يحدّث مسار القمر الصناعي.
     * يقوم بإضافة نقطة الموضع الحالية إلى قائمة النقاط ويحافظ على حجم المسار.
     */
    updateTrail() {
        // أضف نقطة جديدة إلى المسار
        this.trailPoints.push(this.mesh.position.clone());

        // حافظ على عدد النقاط ضمن الحد الأقصى
        if (this.trailPoints.length > MAX_TRAIL_POINTS) {
            this.trailPoints.shift(); // أزل أقدم نقطة
        }

        // حدّث الهندسة الخطية للمسار
        this.trailGeom.setFromPoints(this.trailPoints);
    }

    /**
     * هذه هي الدالة الأساسية التي تقوم بتحديث حالة القمر الصناعي الفيزيائية (موضع وسرعة).
     * يتم استدعاؤها بواسطة PhysicsEngine في كل خطوة زمنية للتكامل.
     *
     * @param {number} integrationTimestep - الخطوة الزمنية الثابتة (بالثواني) التي سيتم خلالها حساب التغيير.
     * @param {function(THREE.Vector3, THREE.Vector3, number): {position: THREE.Vector3, velocity: THREE.Vector3}} integrateFunction - دالة التكامل العددي (مثل Euler أو Runge-Kutta 4) التي ستقوم بالحساب الفعلي.
     */
    updatePhysics(integrationTimestep, integrateFunction) {
        // نطبق دالة التكامل الممررة للحصول على الموضع والسرعة الجديدين
        const newState = integrateFunction(this.position, this.velocity, integrationTimestep);

        // نحدث الخصائص الفيزيائية للقمر الصناعي بالقيم الجديدة.
        // نستخدم .copy() لتجنب إنشاء كائنات جديدة باستمرار، مما يوفر الذاكرة.
        this.position.copy(newState.position);
        this.velocity.copy(newState.velocity);

        // بعد تحديث الموضع الفيزيائي، نحدث الموضع البصري والمسار.
        this.updateVisualPosition();
        this.updateTrail();
    }

    /**
     * يحصل على كائن Mesh البصري للقمر الصناعي.
     * @returns {THREE.Mesh} - كائن Mesh.
     */
    getMesh() {
        return this.mesh;
    }

    /**
     * يحصل على كائن الخط الذي يمثل المسار.
     * @returns {THREE.Line} - كائن Line.
     */
    getTrailLine() {
        return this.trailLine;
    }
}