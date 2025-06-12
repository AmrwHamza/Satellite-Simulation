// src/physics/integrators/EulerComer.js

import * as THREE from "three";
import { calculationAcceleration } from "../equations.js"; // تأكد من المسار الصحيح

/**
 * دالة integrateEuler: تقوم بتطبيق طريقة أويلر-كرومر (Euler-Cromer) للتكامل العددي.
 * هذه الطريقة تُستخدم لحساب الموضع والسرعة الجديدين لجسم بناءً على حالته الحالية.
 * تُفضل Euler-Cromer على Euler الصريحة لأنها تحافظ على الطاقة بشكل أفضل وتكون أكثر استقراراً للمدارات.
 *
 * @param {THREE.Vector3} currentPosition - الموضع الحالي للجسم (بالمتر).
 * @param {THREE.Vector3} currentVelocity - السرعة الحالية للجسم (متر/ثانية).
 * @param {number} h - الخطوة الزمنية (deltaTime) بالثواني.
 * @returns {{position: THREE.Vector3, velocity: THREE.Vector3}} - كائن يحتوي على الموضع والسرعة الجديدين.
 */
export function integrateEuler(currentPosition, currentVelocity, h) {
    // سجلات للمساعدة في التتبع (يمكنك إزالتها لاحقاً)
    console.log("integrateEuler - الموضع الحالي (قبل حساب التسارع):", currentPosition.x, currentPosition.y, currentPosition.z);
    console.log("integrateEuler - السرعة الحالية:", currentVelocity.x, currentVelocity.y, currentVelocity.z);
    console.log("integrateEuler - قيمة h:", h);

    // 1. حساب التسارع عند الموضع الحالي
    // تستخدم دالة calculationAcceleration الموضع الحالي لحساب قوة الجاذبية والتسارع الناتج.
    const acceleration = calculationAcceleration(currentPosition);

    console.log("integrateEuler - التسارع المحسوب:", acceleration.x, acceleration.y, acceleration.z);

    // 2. حساب السرعة الجديدة (v_n+1)
    // باستخدام التسارع المحسوب (a_n) والخطوة الزمنية (h) والسرعة الحالية (v_n).
    // v_n+1 = v_n + a_n * h
    const newVelocity = currentVelocity.clone().add(acceleration.clone().multiplyScalar(h));

    // 3. حساب الموضع الجديد (r_n+1)
    // في طريقة أويلر-كرومر، نستخدم السرعة "الجديدة" (v_n+1) لحساب الموضع.
    // r_n+1 = r_n + v_n+1 * h
    const newPosition = currentPosition.clone().add(newVelocity.clone().multiplyScalar(h)); // **التعديل الحاسم: استخدام newVelocity هنا**

    // التأكد من أن القيم الناتجة صالحة
    if (!isFinite(newPosition.x) || !isFinite(newPosition.y) || !isFinite(newPosition.z) ||
        isNaN(newPosition.x) || isNaN(newPosition.y) || isNaN(newPosition.z) ||
        !isFinite(newVelocity.x) || !isFinite(newVelocity.y) || !isFinite(newVelocity.z) ||
        isNaN(newVelocity.x) || isNaN(newVelocity.y) || isNaN(newVelocity.z)) {
        console.error("integrateEuler: New position or velocity contains NaN or Infinity. This indicates a numerical instability. Please check INTEGRATION_TIMESTEP or constants.");
        // في حالة وجود NaN، نرجع NaN لتجنب انتشار الأخطاء
        return { position: new THREE.Vector3(NaN, NaN, NaN), velocity: new THREE.Vector3(NaN, NaN, NaN) };
    }

    // إرجاع الحالة الجديدة (الموضع والسرعة)
    return { position: newPosition, velocity: newVelocity };
}