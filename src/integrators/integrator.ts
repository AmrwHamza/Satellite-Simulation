import { int } from "three/tsl";
import { IPhysicsState } from "../interfaces/IPhysicsState";

export interface Integrator {
  integrate(state: IPhysicsState, deltaTime: number): IPhysicsState;
}
