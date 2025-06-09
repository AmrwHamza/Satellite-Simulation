// src/physics/PhysicsEngine.js

import * as THREE from 'three';
import { Satellite } from '../objects/satellite.js'; // نحتاج لاستيراد القمر الصناعي لإنشائه هنا
import { integrateEuler } from './integrators/EulerIntegrator.js'; // استيراد أويلر
import { integrateRungeKutta4 } from './integrators/RungeKutta4Integrator.js'; // استيراد RK4

/**
 * فئة PhysicsEngine: مسؤولة عن إدارة الكائنات التي تتأثر بالفيزياء وتحديث حالتها.
 * تعمل كـ "منظم حالة" للجانب الفيزيائي، وتخفف العبء عن main.js.
 */
export class PhysicsEngine {
    constructor() {
        this.satellites = []; // مصفوفة لتخزين الأقمار الصناعية
        this.selectedIntegrator = 'RK4'; // الافتراضي: 'RK4'. يمكن أن يكون 'Euler' أيضاً.
    }

    /**
     * ينشئ قمراً صناعياً جديداً ويضيفه إلى المحرك الفيزيائي.
     * يمكن تحديد الموضع والسرعة الأولية مباشرة هنا.
     *
     * @param {THREE.Vector3} initialPosition - الموضع الأولي (بالمتر).
     * @param {THREE.Vector3} initialVelocity - السرعة الأولية (متر/ثانية).
     * @param {number} [visualRadius=0.2] - نصف قطر القمر الصناعي البصري.
     * @param {number} [color=0xff0000] - لون القمر الصناعي البصري.
     * @returns {Satellite} كائن القمر الصناعي الذي تم إنشاؤه.
     */
    addSatellite(initialPosition, initialVelocity, visualRadius = 0.2, color = 0xff0000) {
        const satellite = new Satellite(initialPosition, initialVelocity, visualRadius, color);
        this.satellites.push(satellite);
        return satellite;
    }

    /**
     * يحدد طريقة التكامل العددي التي سيتم استخدامها لتحديث الفيزياء.
     * @param {string} method - اسم الطريقة: 'Euler' أو 'RK4'.
     */
    setIntegratorMethod(method) {
        if (method === 'Euler' || method === 'RK4') {
            this.selectedIntegrator = method;
            console.log(`Integrator set to: ${method}`);
        } else {
            console.warn(`Invalid integrator method: ${method}. Using default 'RK4'.`);
        }
    }

    /**
     * يقوم بتحديث حالة جميع الكائنات الفيزيائية التي يديرها المحرك.
     * يتم استدعاؤها في كل إطار من حلقة الرسوميات.
     *
     * @param {number} deltaTime - الخطوة الزمنية (بالثواني).
     */
    update(deltaTime) {
        // نختار دالة التكامل بناءً على الطريقة المحددة
        let integrateFunction;
        if (this.selectedIntegrator === 'Euler') {
            integrateFunction = integrateEuler;
        } else { // الافتراضي هو RK4
            integrateFunction = integrateRungeKutta4;
        }

        // تحديث كل قمر صناعي باستخدام دالة التكامل المختارة
        for (const satellite of this.satellites) {
            // هنا نمرر الدوال الفيزيائية المنفصلة لـ Satellite.js ليقوم بتحديث نفسه
            // Satellite.js سيعرف كيف يستخدم integrateFunction على خصائصه الفيزيائية
            satellite.updateWithCustomIntegrator(deltaTime, integrateFunction);
        }
    }

    /**
     * الحصول على جميع الأقمار الصناعية التي يديرها المحرك.
     * @returns {Array<Satellite>}
     */
    getSatellites() {
        return this.satellites;
    }
}