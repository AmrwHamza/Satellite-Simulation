// src/ui/GUIManager.js

// رسالة الملف: يدير واجهة المستخدم الرسومية (GUI) باستخدام مكتبة dat.gui.
// يسمح للمستخدم بالتحكم في إعدادات المحاكاة وإضافة أقمار صناعية جديدة.

import { GUI } from "dat.gui"; // استيراد مكتبة dat.gui
import {
    DEFAULT_INITIAL_SATELLITE_POSITION_X,
    DEFAULT_INITIAL_SATELLITE_POSITION_Y,
    DEFAULT_INITIAL_SATELLITE_POSITION_Z, // جديد: إضافة البعد الثالث
    DEFAULT_INITIAL_SATELLITE_VELOCITY_X,
    DEFAULT_INITIAL_SATELLITE_VELOCITY_Y,
    DEFAULT_INITIAL_SATELLITE_VELOCITY_Z, // جديد: إضافة البعد الثالث
    DEFAULT_SIMULATION_SPEED_MULTIPLIER
} from '../physics/constants.js'; // استيراد القيم الافتراضية من ملف الثوابت

/**
 * فئة GUIManager: مسؤولة عن إنشاء وتنظيم لوحة التحكم (GUI).
 * تربط عناصر التحكم (الأزرار، الأشرطة، حقول الإدخال) بوظائف معينة في المحاكاة.
 */
export class GUIManager {
    constructor() {
        this.gui = new GUI(); // إنشاء كائن GUI جديد من مكتبة dat.gui

        // كائن الإعدادات: هذا الكائن يحمل جميع القيم التي يمكن للمستخدم تغييرها من الـ GUI.
        // عندما يغير المستخدم قيمة في الـ GUI، تتغير القيمة المقابلة هنا.
        this.settings = {
            integrator: "RK4", // طريقة التكامل الافتراضية
            paused: false, // حالة المحاكاة (موقفة مؤقتاً أم لا)
            simulationSpeed: DEFAULT_SIMULATION_SPEED_MULTIPLIER, // سرعة المحاكاة الافتراضية

            // القيم الأولية للقمر الصناعي الجديد الذي سيتم إضافته (بوحدات المتر ومتر/ثانية)
            // هذه القيم ستظهر في مجلد "New Satellite" في الـ GUI.
            newSatName: 'Satellite', // اسم افتراضي
            newSatPosX: DEFAULT_INITIAL_SATELLITE_POSITION_X,
            newSatPosY: DEFAULT_INITIAL_SATELLITE_POSITION_Y,
            newSatPosZ: DEFAULT_INITIAL_SATELLITE_POSITION_Z, // جديد: الموضع Z
            newSatVelX: DEFAULT_INITIAL_SATELLITE_VELOCITY_X,
            newSatVelY: DEFAULT_INITIAL_SATELLITE_VELOCITY_Y,
            newSatVelZ: DEFAULT_INITIAL_SATELLITE_VELOCITY_Z, // جديد: السرعة Z
            
            addSatellite: () => {}, // دالة سيتم استدعاؤها عند النقر على زر "Add Satellite"
            resetSimulation: () => {}, // دالة سيتم استدعاؤها عند النقر على زر "Reset Simulation"
        };

        // دوال رد الاتصال (Callbacks):
        // هذه هي الدوال التي سيتم استدعاؤها في main.js عندما يغير المستخدم شيئاً في الـ GUI.
        // `main.js` سيعين هذه الدوال لاحقاً.
        this.onIntegratorChangeCallback = null;
        this.onPauseToggleCallback = null;
        this.onSimulationSpeedChangeCallback = null;
        this.onAddSatelliteCallback = null;
        this.onResetSimulationCallback = null;
        
        // مصفوفة لتتبع مجلدات الـ GUI الخاصة بالأقمار الصناعية الفردية،
        // لتسهيل إزالتها لاحقاً.
        this.satelliteFolders = new Map(); // نستخدم Map لتخزين المجلدات بالمرجع للقمر الصناعي

        // بناء لوحة التحكم: نضيف المجلدات وعناصر التحكم.
        this.addSimulationControls();
        this.addIntegratorControls();
        this.addNewSatelliteControls();
    }

    /**
     * يضيف عناصر التحكم العامة للمحاكاة (إيقاف مؤقت، سرعة المحاكاة، إعادة تعيين).
     */
    addSimulationControls() {
        const simFolder = this.gui.addFolder("Simulation Controls"); // مجلد للتحكم في المحاكاة
        
        // زر إيقاف/استئناف المحاكاة
        simFolder.add(this.settings, 'paused')
            .name('Pause / Resume')
            .onChange((value) => {
                // عندما تتغير حالة الإيقاف المؤقت، نستدعي الكولباك في main.js
                if (this.onPauseToggleCallback) {
                    this.onPauseToggleCallback(value);
                }
            });

        // شريط تمرير للتحكم في سرعة المحاكاة
        // النطاق من 0.1 (بطيء جداً) إلى 100 (سريع جداً)، بخطوات 0.1.
        simFolder.add(this.settings, 'simulationSpeed', 0.1, 100.0).step(0.1)
            .name('Speed Multiplier (x)')
            .onChange((value) => {
                // عندما تتغير سرعة المحاكاة، نستدعي الكولباك في main.js
                if (this.onSimulationSpeedChangeCallback) {
                    this.onSimulationSpeedChangeCallback(value);
                }
            });
        
        // زر إعادة تعيين المحاكاة
        simFolder.add(this.settings, 'resetSimulation')
            .name('Reset All Satellites')
            .onFinishChange(() => { // نستخدم onFinishChange لزر
                if (this.onResetSimulationCallback) {
                    this.onResetSimulationCallback();
                }
            });

        simFolder.open(); // افتح المجلد تلقائياً عند بدء التشغيل
    }

    /**
     * يضيف عناصر التحكم لاختيار طريقة التكامل الفيزيائي.
     */
    addIntegratorControls() {
        const integratorFolder = this.gui.addFolder("Physics Integrator"); // مجلد لطرق التكامل
        
        // قائمة منسدلة لاختيار بين Euler و RK4
        integratorFolder
            .add(this.settings, "integrator", ["Euler", "RK4"])
            .name("Method")
            .onChange((value) => {
                if (this.onIntegratorChangeCallback) {
                    this.onIntegratorChangeCallback(value);
                }
            });
        integratorFolder.open();
    }

    /**
     * يضيف عناصر التحكم لإنشاء قمر صناعي جديد.
     * تتضمن حقول لإدخال الموضع والسرعة الأولية (بما في ذلك البعد الثالث).
     */
    addNewSatelliteControls() {
        const newSatFolder = this.gui.addFolder("Add New Satellite"); // مجلد لإضافة قمر جديد
        
        newSatFolder.add(this.settings, 'newSatName').name('Name');
        
        // الموضع الأولي (X, Y, Z) بالمتر
        // نطاقات القيم: من 6.5 مليون متر (قريب من سطح الأرض) إلى 50 مليون متر (أبعد).
        // الخطوة (step) كبيرة لأن القيم كبيرة.
        newSatFolder.add(this.settings, 'newSatPosX', 6.5e6, 50e6).step(1e5).name('Pos X (m)');
        newSatFolder.add(this.settings, 'newSatPosY', -50e6, 50e6).step(1e5).name('Pos Y (m)');
        newSatFolder.add(this.settings, 'newSatPosZ', -50e6, 50e6).step(1e5).name('Pos Z (m)'); // جديد: Pos Z
        
        // السرعة الأولية (X, Y, Z) بالمتر/ثانية
        // نطاقات القيم: من -10000 إلى 10000 متر/ثانية (مناسبة لسرعات المدار).
        newSatFolder.add(this.settings, 'newSatVelX', -10000, 10000).step(100).name('Vel X (m/s)');
        newSatFolder.add(this.settings, 'newSatVelY', -10000, 10000).step(100).name('Vel Y (m/s)');
        newSatFolder.add(this.settings, 'newSatVelZ', -10000, 10000).step(100).name('Vel Z (m/s)'); // جديد: Vel Z

        // زر إضافة القمر الصناعي. عند النقر عليه، نستدعي الكولباك في main.js.
        newSatFolder.add(this.settings, 'addSatellite')
            .name('Add Satellite')
            .onFinishChange(() => {
                if (this.onAddSatelliteCallback) {
                    // نمرر جميع القيم التي أدخلها المستخدم للقمر الصناعي الجديد
                    this.onAddSatelliteCallback({
                        name: this.settings.newSatName,
                        rX: this.settings.newSatPosX,
                        rY: this.settings.newSatPosY,
                        rZ: this.settings.newSatPosZ,
                        vX: this.settings.newSatVelX,
                        vY: this.settings.newSatVelY,
                        vZ: this.settings.newSatVelZ
                    });
                }
            });
        
        newSatFolder.open();
    }

    /**
     * يضيف مجلداً جديداً في الـ GUI لكل قمر صناعي يتم إنشاؤه.
     * هذا المجلد سيعرض معلومات القمر الصناعي الحالية وزر لإزالته.
     * @param {object} satellite - كائن القمر الصناعي الذي تم إنشاؤه (من فئة Satellite).
     * @param {function} onRemoveCallback - دالة تستدعى في main.js عند إزالة القمر.
     */
    addSatelliteIndividualControls(satellite, onRemoveCallback) {
        // نستخدم اسم القمر الصناعي لإنشاء مجلد فريد له في الـ GUI.
        const folder = this.gui.addFolder(`Satellite: ${satellite.name}`);
        
        // إضافة عناصر عرض (listen()) التي تعرض القيم الحالية للموضع والسرعة.
        // .listen() يجعل هذه القيم تتحدث تلقائياً في الـ GUI كلما تغيرت.
        folder.add(satellite.position, 'x').name('Pos X (m)').listen();
        folder.add(satellite.position, 'y').name('Pos Y (m)').listen();
        folder.add(satellite.position, 'z').name('Pos Z (m)').listen(); // Pos Z
        
        folder.add(satellite.velocity, 'x').name('Vel X (m/s)').listen();
        folder.add(satellite.velocity, 'y').name('Vel Y (m/s)').listen();
        folder.add(satellite.velocity, 'z').name('Vel Z (m/s)').listen(); // Vel Z

        // إضافة خصائص محسوبة (Altitude و Speed) للقمر الصناعي
        folder.add(satellite, 'getAltitudeKm').name('Altitude').listen();
        folder.add(satellite, 'getSpeedKmPerSec').name('Speed').listen();

        // زر إزالة هذا القمر الصناعي المحدد.
        folder.add({ remove: () => {
            onRemoveCallback(satellite, folder); // نمرر القمر الصناعي والمجلد ليتم إزالتهما
        }}, 'remove').name('Remove Satellite');
        
        folder.open(); // افتح مجلد القمر الصناعي تلقائياً

        // نخزن مرجعاً للمجلد في الـ Map لسهولة إزالته لاحقاً.
        this.satelliteFolders.set(satellite, folder);
    }

    /**
     * يزيل مجلد GUI الخاص بقمر صناعي معين.
     * @param {object} satellite - كائن القمر الصناعي الذي تم إزالته.
     */
    removeSatelliteIndividualControls(satellite) {
        const folder = this.satelliteFolders.get(satellite);
        if (folder) {
            this.gui.removeFolder(folder); // إزالة المجلد من الـ GUI
            this.satelliteFolders.delete(satellite); // إزالته من الـ Map
        }
    }

    // --- دوال لتعيين دوال رد الاتصال (Callbacks) من main.js ---
    // هذه الدوال تسمح لـ main.js بأن "يخبر" GUIManager ما الذي يجب فعله
    // عندما يقوم المستخدم بتغيير شيء ما في الـ GUI.

    setOnIntegratorChange(callback) {
        this.onIntegratorChangeCallback = callback;
    }

    setOnPauseToggle(callback) {
        this.onPauseToggleCallback = callback;
    }

    setOnSimulationSpeedChange(callback) {
        this.onSimulationSpeedChangeCallback = callback;
    }

    setOnAddSatellite(callback) {
        this.onAddSatelliteCallback = callback;
    }

    setOnResetSimulation(callback) {
        this.onResetSimulationCallback = callback;
    }

    /**
     * يقوم بتحديث القيم المعروضة في الـ GUI لتعكس حالة معينة (مثلاً عند إعادة تعيين المحاكاة).
     * @param {boolean} pausedState - حالة الإيقاف المؤقت الجديدة.
     * @param {number} simulationSpeed - عامل سرعة المحاكاة الجديد.
     * @param {object} newSatParams - القيم الافتراضية الجديدة للقمر الصناعي.
     */
    updateGUIState(pausedState, simulationSpeed, newSatParams) {
        this.settings.paused = pausedState;
        this.settings.simulationSpeed = simulationSpeed;
        
        // تحديث حقول إضافة قمر جديد إلى القيم الافتراضية
        this.settings.newSatName = newSatParams.name;
        this.settings.newSatPosX = newSatParams.rX;
        this.settings.newSatPosY = newSatParams.rY;
        this.settings.newSatPosZ = newSatParams.rZ;
        this.settings.newSatVelX = newSatParams.vX;
        this.settings.newSatVelY = newSatParams.vY;
        this.settings.newSatVelZ = newSatParams.vZ;

        // يجب استدعاء updateDisplay() لكل عنصر تحكم ليتم تحديث قيمته المرئية في الـ GUI
        // هذه الطريقة تمر على جميع عناصر التحكم وتحدثها.
        for (const i in this.gui.__controllers) {
            this.gui.__controllers[i].updateDisplay();
        }
        for (const f of this.gui.__folders) {
            for (const i in f.__controllers) {
                f.__controllers[i].updateDisplay();
            }
        }
    }
}