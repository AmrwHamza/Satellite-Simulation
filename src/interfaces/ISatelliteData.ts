import { Vector3 } from 'three';
// import { IntegratorMethod } from '../utils/types'; 

export interface ISatelliteData{

    id:string;
    name:string;
    initialPosition: Vector3;
    initialVelocity: Vector3;
    // selectedIntegrator: IntegratorMethod;



}