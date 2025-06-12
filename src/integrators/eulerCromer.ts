import { Vector3 } from "three/src/Three.Core.js";
import { IPhysicsState } from "../interfaces/IPhysicsState";
import { Integrator } from "./integrator";
import { ME } from "../physics/constants";
import { calculateAcceleration } from "../physics/equations";

export class EulerCromer implements Integrator {

    integrate(state: IPhysicsState, deltaTime: number): IPhysicsState {
        
        const currentPositionX=state.position.x;
        const currentPositionY=state.position.y;
        const currentPositionZ=state.position.z;
        
        const currentVelocityX=state.velocity.x;
        const currentVelocityY=state.velocity.y;
        const currentVelocityZ=state.velocity.z;

        const tempPositionVector=new Vector3(currentPositionX,currentPositionY,currentPositionZ);

        const acceleration=calculateAcceleration(tempPositionVector,ME);

        const newVelocityX=currentVelocityX+acceleration.x*deltaTime;
        const newVelocityY=currentVelocityY+acceleration.y*deltaTime;
        const newVelocityZ=currentVelocityZ+acceleration.z*deltaTime;


        const newPositionX=currentPositionX+newVelocityX*deltaTime;
        const newPositionY=currentPositionY+newVelocityY*deltaTime;
        const newPositionZ=currentPositionZ+newVelocityZ*deltaTime;








        return {
            position: new Vector3(newPositionX,newPositionY,newPositionZ),
            velocity: new Vector3(newVelocityX,newVelocityY,newVelocityZ)
        };
    }


}