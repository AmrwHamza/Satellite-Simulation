import * as THREE from "three";
 

import {G,EARTH_MASS} from "./constants.js"


//calc the a 
export function calculationAcceleration(position){


/**
نحسب r 
وهي المسافة من مركز الأرض الى القمر الصناعي  
 */
const r =Math.sqrt(position.x*position.x + position.y*position.y + position.z*position.z);

    // إذا كان الجسم قريباً جداً من المركز، نتجنب القسمة على صفر
    if (r < 1e-6) { // قيمة صغيرة جداً لتجنب الأخطاء
        return new THREE.Vector3(0, 0, 0);
    }

// حسال تكعيب r
    const rCub=r*r*r;

// المعامل يلي عم نضرب فيه x y z 
    const gmr= -(G*EARTH_MASS)/rCub;

    //حساب مركبات التسارع 
const ax=gmr*position.x;
const ay=gmr*position.y;
const az=gmr*position.z;

// عم رجه  متجه السرعة 
return new THREE.Vector3(ax,ay,az);



}