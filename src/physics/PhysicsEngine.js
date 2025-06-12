// src/physics/PhysicsEngine.js

import { integrateEuler } from "./integrators/EulerComer.js";
import { integrateRungeKutta4 } from "./integrators/RungeKutta4.js";
import { DEFAULT_SIMULATION_SPEED_MULTIPLIER, INTEGRATION_TIMESTEP } from "../physics/constants.js";

/**
 * فئة PhysicsEngine: تدير جميع الكائنات الفيزيائية في المحاكاة وتطبق عليها قوانين الفيزياء.
 * هي المسؤولة عن تحديث موضع وسرعة كل قمر صناعي خطوة بخطوة.
 */
export class PhysicsEngine {
    constructor() {
        this.physicalObjects = []; // مصفوفة لتخزين جميع الكائنات التي تتأثر بالفيزياء (مثل الأقمار الصناعية)
        this.integratorMethod = "Euler"; // طريقة التكامل الافتراضية: "Euler" أو "RK4"
        this.simulationSpeedMultiplier = DEFAULT_SIMULATION_SPEED_MULTIPLIER; // عامل سرعة المحاكاة (1.0 = سرعة حقيقية)
    }

    /**
     * يضيف كائناً فيزيائياً إلى المحرك ليتم تضمينه في حسابات الفيزياء.
     * @param {object} object - الكائن الذي يجب إضافته (يجب أن يحتوي على دالة updatePhysics).
     */
    addObject(object) {
        this.physicalObjects.push(object);
    }

    /**
     * يزيل كائناً فيزيائياً من المحرك.
     * @param {object} object - الكائن الذي يجب إزالته.
     */
    removeObject(object) {
        this.physicalObjects = this.physicalObjects.filter(obj => obj !== object);
    }

    /**
     * يحدد طريقة التكامل العددي التي سيتم استخدامها.
     * @param {string} method - اسم الطريقة ("Euler" أو "RK4").
     */
    setIntegratorMethod(method) {
        if (method === "Euler" || method === "RK4") {
            this.integratorMethod = method;
            console.log(`طريقة التكامل تغيرت إلى: ${method}`);
        } else {
            console.warn(`طريقة التكامل "${method}" غير مدعومة.`);
        }
    }

    /**
     * هذه هي الدالة الأساسية التي تقوم بتحديث حالة جميع الكائنات الفيزيائية.
     * يتم استدعاؤها في كل إطار من حلقة الرسوم المتحركة الرئيسية.
     *
     * @param {number} realDeltaTime - الفارق الزمني الحقيقي (بالثواني) منذ الإطار الأخير.
     */
    update(realDeltaTime) {
        // تحديد دالة التكامل بناءً على الطريقة المختارة
        const integrateFunction = this.integratorMethod === "Euler" ? integrateEuler : integrateRungeKutta4;

        // نحسب عدد الخطوات الفيزيائية التي يجب أن تحدث في هذا الإطار.
        // نضرب في realDeltaTime لضبط سرعة المحاكاة بناءً على أداء المتصفح،
        // ونقسم على INTEGRATION_TIMESTEP للحصول على عدد التكرارات.
        // Math.ceil يضمن أننا نغطي الفترة الزمنية بأكملها.
        const numPhysicsSteps = Math.ceil(realDeltaTime * this.simulationSpeedMultiplier / INTEGRATION_TIMESTEP);

        // نقوم بتكرار خطوات التكامل لجميع الكائنات الفيزيائية.
        // كل تكرار يمثل خطوة زمنية صغيرة وثابتة (INTEGRATION_TIMESTEP).
        for (let i = 0; i < numPhysicsSteps; i++) {
            this.physicalObjects.forEach(object => {
                // نمرر خطوة التكامل الثابتة إلى دالة updatePhysics لكل كائن.
                object.updatePhysics(INTEGRATION_TIMESTEP, integrateFunction);
            });
        }
    }
}