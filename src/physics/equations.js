// src/physics/equations.js

import * as THREE from "three";
import { G, EARTH_MASS, EARTH_RADIUS_METERS } from "./constants.js";

/**
 * يحسب التسارع الناتج عن الجاذبية للأرض على جسم في موضع معين.
 * يستخدم قانون نيوتن للجاذبية.
 *
 * @param {THREE.Vector3} position - موضع الجسم (بالمتر).
 * @returns {THREE.Vector3} - متجه التسارع (متر/ثانية^2).
 */
export function calculationAcceleration(position) {
    // سجل لمراقبة المدخلات (يمكن إزالته لاحقاً)
    console.log("calculationAcceleration - موضع المدخل (في البداية):", position.x, position.y, position.z);

    // فحص المدخلات لتجنب NaN أو Infinity
    if (!isFinite(position.x) || !isFinite(position.y) || !isFinite(position.z) ||
        isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
        console.warn("Input position to calculationAcceleration contains NaN or Infinity values. Returning zero acceleration.");
        return new THREE.Vector3(0, 0, 0);
    }

    // حساب مربع المسافة من مركز الأرض
    const r_magnitude_squared = position.lengthSq(); // r^2

    // فحص لتجنب القسمة على صفر أو أرقام ضخمة جداً بالقرب من المركز (إذا كان القمر الصناعي داخل الأرض تقريباً)
    // نضع حداً أدنى للمسافة لتجنب مشاكل الجاذبية اللانهائية
    const MIN_DISTANCE_SQ = (EARTH_RADIUS_METERS * 0.9) * (EARTH_RADIUS_METERS * 0.9); // مثلاً: 90% من نصف قطر الأرض مربع
    if (r_magnitude_squared < MIN_DISTANCE_SQ) {
        console.warn("Object too close to Earth's center or inside Earth. Returning zero acceleration to prevent instability.");
        return new THREE.Vector3(0, 0, 0);
    }

    // حساب مقدار عامل الجاذبية: -G * M_earth / r^2
    const gravitationalFactor = -G * EARTH_MASS / r_magnitude_squared;

    // فحص عامل الجاذبية (يمكن أن يصبح Infinity أو NaN إذا كانت r_magnitude_squared صغيرة جداً)
    if (!isFinite(gravitationalFactor) || isNaN(gravitationalFactor)) {
        console.warn("Gravitational factor is NaN or Infinity. Returning zero acceleration.");
        return new THREE.Vector3(0, 0, 0);
    }

    // حساب متجه التسارع: (الموضع المنظم) * عامل الجاذبية
    const acceleration = position.clone().normalize().multiplyScalar(gravitationalFactor);

    // فحص نهائي لمكونات التسارع
    if (!isFinite(acceleration.x) || !isFinite(acceleration.y) || !isFinite(acceleration.z) ||
        isNaN(acceleration.x) || isNaN(acceleration.y) || isNaN(acceleration.z)) {
        console.warn("Calculated acceleration contains NaN or Infinity values. Returning zero acceleration.");
        return new THREE.Vector3(0, 0, 0);
    }

    return acceleration;
}