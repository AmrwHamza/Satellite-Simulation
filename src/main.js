// main.js

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

import {
  EARTH_RADIUS_VISUAL,
  EARTH_RADIUS_METERS,
  VISUAL_SCALE_FACTOR,
  DEFAULT_INITIAL_SATELLITE_POSITION_X,
  DEFAULT_INITIAL_SATELLITE_VELOCITY_Y,
  DEFAULT_SIMULATION_SPEED_MULTIPLIER,
  G,
  EARTH_MASS,
  INTEGRATION_TIMESTEP, // تأكد من استيراد هذا الثابت الجديد
} from "./physics/constants.js";
import { Satellite } from "./objects/satellite.js";
import { PhysicsEngine } from "./physics/PhysicsEngine.js";
import { initGUI } from "./utils/gui.js"; // تأكد من وجود هذا الملف ودالة initGUI

// --- المشهد، الكاميرا، المسرّع ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20000 // زِد مدى الرؤية للكاميرا إذا كانت الأجسام تختفي
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // لتمكين التخميد (التحكم السلس)
controls.dampingFactor = 0.05; // عامل التخميد

// --- الإضاءة ---
const ambientLight = new THREE.AmbientLight(0x333333); // إضاءة محيطة ناعمة
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // ضوء اتجاهي قوي
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// --- الأرض ---
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS_VISUAL, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // لون أزرق للأرض
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// --- تهيئة محرك الفيزياء ---
const physicsEngine = new PhysicsEngine();

// --- إضافة قمر صناعي افتراضي ---
let satellite; // تعريف القمر الصناعي هنا لجعله متاحاً عالمياً
function addSatellite(params) {
  const initialPosition = new THREE.Vector3(params.rX, params.rY, params.rZ);
  const initialVelocity = new THREE.Vector3(params.vX, params.vY, params.vZ);

  // قم بإزالة القمر الصناعي والمسار القديم إن وجد
  if (satellite) {
    scene.remove(satellite.getMesh());
    scene.remove(satellite.getTrailLine());
    physicsEngine.removeObject(satellite); // إزالة من محرك الفيزياء
  }

  satellite = new Satellite(initialPosition, initialVelocity);
  scene.add(satellite.getMesh());
  scene.add(satellite.getTrailLine()); // إضافة المسار إلى المشهد
  physicsEngine.addObject(satellite); // إضافة القمر الصناعي إلى محرك الفيزياء

  console.log("تم إضافة قمر صناعي:", params.name);

  // عند إضافة قمر صناعي جديد، أعد ضبط الكاميرا لمراقبته
  resetCameraPosition();
}

// تهيئة واجهة المستخدم الرسومية (GUI)
const gui = new GUI();
initGUI(gui, {
  addSatellite: addSatellite,
  physicsEngine: physicsEngine,
  constants: {
    G,
    EARTH_MASS,
    EARTH_RADIUS_METERS,
    VISUAL_SCALE_FACTOR,
    EARTH_RADIUS_VISUAL,
    SATELLITE_RADIUS_VISUAL,
    DEFAULT_INITIAL_SATELLITE_POSITION_X,
    DEFAULT_INITIAL_SATELLITE_VELOCITY_Y,
    DEFAULT_SIMULATION_SPEED_MULTIPLIER,
  },
});

// إعداد الكاميرا الأولية
camera.position.z = EARTH_RADIUS_VISUAL * 4; // مكان جيد لبدء الرؤية

// --- تهيئة المحاكاة ---
function init() {
  // إضافة قمر صناعي افتراضي عند البدء
  addSatellite({
    name: "Initial Sat",
    rX: DEFAULT_INITIAL_SATELLITE_POSITION_X,
    rY: DEFAULT_INITIAL_SATELLITE_POSITION_Y,
    rZ: DEFAULT_INITIAL_SATELLITE_POSITION_Z,
    vX: DEFAULT_INITIAL_SATELLITE_VELOCITY_X,
    vY: DEFAULT_INITIAL_SATELLITE_VELOCITY_Y,
    vZ: DEFAULT_INITIAL_SATELLITE_VELOCITY_Z,
  });

  lastTime = performance.now(); // لتهيئة lastTime لأول مرة
  animate();
}

// --- حلقة المحاكاة ---
let lastTime = 0;

function animate() {
  requestAnimationFrame(animate);

  const currentTime = performance.now();
  let deltaTime = (currentTime - lastTime) / 1000; // تحويل إلى ثوانٍ

  // *** التعديل الرئيسي في هذا الملف: لا تحدد deltaTime هنا
  // *** ستقوم PhysicsEngine بتحديد عدد خطوات التكامل بناءً على هذا الـ deltaTime وعامل السرعة.

  lastTime = currentTime;

  // تحديث الفيزياء
  physicsEngine.update(deltaTime); // تمرير deltaTime الفعلي لـ PhysicsEngine

  // تحديث عناصر Three.js
  controls.update(); // يجب استدعاء هذا إذا كانت enableDamping مفعلة
  renderer.render(scene, camera);
}

function resetCameraPosition() {
  if (satellite && satellite.getMesh()) {
    const satPos = satellite.getMesh().position;
    // ضع الكاميرا خلف القمر الصناعي بمسافة معينة
    camera.position.set(satPos.x + 300, satPos.y + 300, satPos.z + 300);
    camera.lookAt(satPos); // اجعل الكاميرا تنظر إلى القمر الصناعي
    controls.target.copy(satPos); // اجعل عناصر التحكم تركز على القمر الصناعي أيضاً
  }
}

// استدعاء دالة التهيئة لبدء كل شيء
init();

// معالجة تغيير حجم النافذة
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
