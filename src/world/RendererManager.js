// src/world/RendererManager.js

import * as THREE from 'three';

/**
 * فئة لإدارة عارض WebGL (WebGLRenderer) لـ Three.js.
 */
export class RendererManager {
    constructor(width, height) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.setupRenderer(width, height);
    }

    /**
     * تقوم بإعداد خصائص العارض الأولية.
     * @param {number} width - العرض الأولي.
     * @param {number} height - الارتفاع الأولي.
     * @private
     */
    setupRenderer(width, height) {
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000); // خلفية سوداء (فضاء)

        // إلحاق عنصر canvas بالـ DOM
        document.body.appendChild(this.renderer.domElement);
    }

    /**
     * تعيد كائن العارض (THREE.WebGLRenderer).
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * تقوم بتحديث حجم العارض عند تغيير حجم النافذة.
     * @param {number} width - العرض الجديد.
     * @param {number} height - الارتفاع الجديد.
     */
    updateSize(width, height) {
        this.renderer.setSize(width, height);
    }

    /**
     * تقوم بعرض المشهد باستخدام الكاميرا المحددة.
     * @param {THREE.Scene} scene - المشهد المراد عرضه.
     * @param {THREE.Camera} camera - الكاميرا التي ستعرض المشهد من خلالها.
     */
    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}