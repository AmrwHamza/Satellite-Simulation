 import * as THREE from "three";
 import { calculationAcceleration } from "../equations";



 export function integrateEuler(currentPosition, currentVelocity, deltaTime){

    const acceleration = calculationAcceleration(currentPosition);


    const newVx=currentVelocity.x+acceleration.x*deltaTime;
    const newVy=currentVelocity.y+acceleration.y*deltaTime;
    const newVz=currentVelocity.z+acceleration.z*deltaTime;

    const newPosX=currentPosition.x+newVx*deltaTime;
    const newPosY=currentPosition.y+newVy*deltaTime;
    const newPosZ=currentPosition.z+newVz*deltaTime;

    const newPosition=new THREE.Vector3(newPosX,newPosY,newPosZ);
    const newVelocity=new THREE.Vector3(newVx,newVy,newVz);
    return {position:newPosition,velocity:newVelocity};
 }