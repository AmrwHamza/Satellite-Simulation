// src/state/AppState.js

/**
 * فئة بسيطة لإدارة الحالة العامة للتطبيق.
 * تخزن مراجع للمكونات الرئيسية (الأرض، القمر الصناعي، المشهد، الكاميرا، العارض)
 * لتسهيل الوصول إليها من أجزاء مختلفة من التطبيق.
 * هذا يقلل من عدد المتغيرات العامة في main.js. 
 */
export class AppState {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.satellite = null;
        // يمكن إضافة المزيد من الكائنات أو الحالات هنا لاحقاً
    }

    /**
     * تعيين المشهد.
     * @param {THREE.Scene} scene
     */
    setScene(scene) {
        this.scene = scene;
    }

    /**
     * الحصول على المشهد.
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }

    /**
     * تعيين الكاميرا.
     * @param {THREE.Camera} camera
     */
    setCamera(camera) {
        this.camera = camera;
    }

    /**
     * الحصول على الكاميرا.
     * @returns {THREE.Camera}
     */
    getCamera() {
        return this.camera;
    }

    /**
     * تعيين العارض.
     * @param {THREE.WebGLRenderer} renderer
     */
    setRenderer(renderer) {
        this.renderer = renderer;
    }

    /**
     * الحصول على العارض.
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * تعيين كائن الأرض.
     * @param {Earth} earth
     */
    setEarth(earth) {
        this.earth = earth;
    }

    /**
     * الحصول على كائن الأرض.
     * @returns {Earth}
     */
    getEarth() {
        return this.earth;
    }

    /**
     * تعيين كائن القمر الصناعي.
     * @param {Satellite} satellite
     */
    setSatellite(satellite) {
        this.satellite = satellite;
    }

    /**
     * الحصول على كائن القمر الصناعي.
     * @returns {Satellite}
     */
    getSatellite() {
        return this.satellite;
    }
}