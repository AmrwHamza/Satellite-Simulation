import { EulerCromer } from "../integrators/eulerCromer";
import { Integrator } from "../integrators/integrator";
import { IPhysicsState } from "../interfaces/IPhysicsState";
import { IntegratorMethod } from "../utils/types";

export class PhysicsEngine{

    private currentIntegrator: Integrator;

    private integrators: Map<IntegratorMethod, Integrator>;


    constructor(){

this .integrators=new Map<IntegratorMethod, Integrator>();
        this.integrators.set('Euler-Cromer', new EulerCromer());
// this.integrators.set('Runge-Kutta 4', new RungeKutta4());

        this.setIntegrator('Euler-Cromer');

    }

  setIntegrator(methodName: IntegratorMethod): void {
        const selectedIntegrator = this.integrators.get(methodName);
        if (selectedIntegrator) {
            this.currentIntegrator = selectedIntegrator;
            console.log(`PhysicsEngine: Integrator set to ${methodName}`);
        } else {
            console.warn(`PhysicsEngine: Integrator method '${methodName}' not found. Using current integrator.`);
            
        }
    }


 updateSatelliteState(state: IPhysicsState, deltaTime: number): IPhysicsState {
        if (!this.currentIntegrator) {
            console.error("PhysicsEngine: No integrator selected!");
            return state; 
        }
       
        return this.currentIntegrator.integrate(state, deltaTime);
    }



}