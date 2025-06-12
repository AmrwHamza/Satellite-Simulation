import { Vector3 } from "three";
import { G } from "./constants";

export function calculateAcceleration(position:Vector3,centralMass:number):Vector3{



const r=Math.sqrt((position.x*position.x)+(position.y*position.y)+(position.z*position.z));

if (r === 0) {
        
        return new Vector3(0, 0, 0);
    }


    const factor =-G*centralMass/(r*r*r);

const ax=position.x*factor;
const ay=position.y*factor;
const az=position.z*factor;
    

return new Vector3(ax,ay,az);

}