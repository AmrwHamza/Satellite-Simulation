// src/main.js

import * as THREE from 'three';
import { SceneManager } from './world/SceneManager.js';
import { CameraManager } from './world/CameraManager.js';
import { RendererManager } from './world/RendererManager.js';
import { Earth } from './objects/Earth.js';
import { PhysicsEngine } from './physics/PhysicsEngine.js'; // استيراد محرك الفيزياء الجديد

// متغير لآخر وقت للحساب (لخطوة الزمن)
let lastTimestamp = 0;

// متغيرات عامة للمدراء والكائنات لسهولة الوصول إليها في الدوال
let sceneManager;
let cameraManager;
let rendererManager;
let earth;
let physicsEngine; // محرك الفيزياء الخاص بنا

/**
 * دالة التهيئة الأولية للتطبيق بأكمله.
 * يتم استدعاؤها مرة واحدة عند تحميل الصفحة.
 */
function init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. إنشاء مدراء المشهد، الكاميرا، والعارض
    sceneManager = new SceneManager();
    cameraManager = new CameraManager(width, height);
    rendererManager = new RendererManager(width, height);

    // 2. إنشاء كائن الأرض وإضافته إلى المشهد
    earth = new Earth();
    sceneManager.addObject(earth.getMesh());

    // 3. إنشاء محرك الفيزياء (PhysicsEngine)
    physicsEngine = new PhysicsEngine();

    // 4. تحديد الموضع والسرعة الأولية للقمر الصناعي بشكل مباشر
    // هذه هي القيم التي يمكنك تعديلها يدوياً لتغيير المدار.
    const initialSatellitePosition = new THREE.Vector3(7000 * 1000, 0, 0); // 7,000,000 متر (7000 كم) على محور X
    const initialSatelliteVelocity = new THREE.Vector3(0, 7500, 0);       // 7,500 متر/ثانية (7.5 كم/ث) على محور Y

    // 5. إضافة القمر الصناعي إلى محرك الفيزياء والمشهد
    // PhysicsEngine هي المسؤولة عن إنشاء Satellite وإضافته
    const satellite = physicsEngine.addSatellite(initialSatellitePosition, initialSatelliteVelocity, 0.2);
    sceneManager.addObject(satellite.getMesh()); // إضافة التمثيل البصري للقمر الصناعي إلى المشهد

    // 6. اختيار طريقة التكامل (يمكنك التبديل بين 'Euler' و 'RK4')
    physicsEngine.setIntegratorMethod('RK4'); // اختر 'RK4' للدقة أو 'Euler' للبساطة

    // 7. إضافة معالج حدث لتغيير حجم النافذة
    window.addEventListener('resize', onWindowResize);

    // 8. بدء حلقة الرسوميات الرئيسية
    lastTimestamp = performance.now();
    animate();
}

/**
 * دالة لمعالجة حدث تغيير حجم النافذة.
 * تضمن تحديث أبعاد الكاميرا والعارض بشكل صحيح.
 */
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    cameraManager.updateAspectRatio(width, height);
    rendererManager.updateSize(width, height);
}

/**
 * حلقة الرسوميات الرئيسية (Animation Loop).
 * يتم استدعاؤها باستمرار بواسطة المتصفح لرسم إطار جديد.
 * @param {number} timestamp - الوقت الحالي بالمللي ثانية منذ تحميل الصفحة.
 */
function animate(timestamp) {
    requestAnimationFrame(animate);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // 1. تحديث حالة كائنات المحاكاة
    // الأرض (تحديث بصري فقط)
    earth.update(deltaTime);
    // محرك الفيزياء (يحدث جميع الأقمار الصناعية التي يديرها فيزيائياً وبصرياً)
    physicsEngine.update(deltaTime);

    // 2. عرض المشهد
    rendererManager.render(sceneManager.getScene(), cameraManager.getCamera());
}

// ابدأ عملية التهيئة عندما يتم تحميل جميع عناصر DOM في الصفحة
document.addEventListener('DOMContentLoaded', init);