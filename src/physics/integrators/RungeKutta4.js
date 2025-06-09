// src/physics/integrators/RungeKutta4Integrator.js

import * as THREE from "three";
import { calculationAcceleration } from "../equations.js";

export function integrateRungeKutta4(
  currentPosition,
  currentVelocity,
  deltaTime
) {
  const r = currentPosition;
  const v = currentVelocity;
  const h = deltaTime;

  const k1x = v.x;
  const k1y = v.y;
  const k1z = v.z;

  const acceleration_at_r = calculationAcceleration(r);
  const k1vx = acceleration_at_r.x;
  const k1vy = acceleration_at_r.y;
  const k1vz = acceleration_at_r.z;

  const k2x = v.x + 0.5 * k1vx * h;
  const k2y = v.y + 0.5 * k1vy * h;
  const k2z = v.z + 0.5 * k1vz * h;

  const r_k2_x = r.x + 0.5 * k1x * h;
  const r_k2_y = r.y + 0.5 * k1y * h;
  const r_k2_z = r.z + 0.5 * k1z * h;
  const r_k2 = new THREE.Vector3(r_k2_x, r_k2_y, r_k2_z);

  const acceleration_at_r_k2 = calculationAcceleration(r_k2);
  const k2vx = acceleration_at_r_k2.x;
  const k2vy = acceleration_at_r_k2.y;
  const k2vz = acceleration_at_r_k2.z;

  const k3rx = v.x + 0.5 * k2vx * h;
  const k3ry = v.y + 0.5 * k2vy * h;
  const k3rz = v.z + 0.5 * k2vz * h;

  const r_k3_x = r.x + 0.5 * k2x * h;
  const r_k3_y = r.y + 0.5 * k2y * h;
  const r_k3_z = r.z + 0.5 * k2z * h;
  const r_k3 = new THREE.Vector3(r_k3_x, r_k3_y, r_k3_z);

  const acceleration_at_r_k3 = calculationAcceleration(r_k3);
  const k3vx = acceleration_at_r_k3.x;
  const k3vy = acceleration_at_r_k3.y;
  const k3vz = acceleration_at_r_k3.z;

  const k4_dr_x = v.x + k3vx * h;
  const k4_dr_y = v.y + k3vy * h;
  const k4_dr_z = v.z + k3vz * h;

  const r_k4_x = r.x + k3rx * h;
  const r_k4_y = r.y + k3ry * h;
  const r_k4_z = r.z + k3rz * h;
  const r_k4 = new THREE.Vector3(r_k4_x, r_k4_y, r_k4_z);

  const acceleration_at_r_k4 = calculationAcceleration(r_k4);
  const k4_dv_x = acceleration_at_r_k4.x;
  const k4_dv_y = acceleration_at_r_k4.y;
  const k4_dv_z = acceleration_at_r_k4.z;

  const newPositionX = r.x + (h / 6) * (k1x + 2 * k2x + 2 * k3rx + k4_dr_x);
  const newPositionY = r.y + (h / 6) * (k1y + 2 * k2y + 2 * k3ry + k4_dr_y);
  const newPositionZ = r.z + (h / 6) * (k1z + 2 * k2z + 2 * k3rz + k4_dr_z);
  const newPosition = new THREE.Vector3(
    newPositionX,
    newPositionY,
    newPositionZ
  );

  const newVelocityX = v.x + (h / 6) * (k1vx + 2 * k2vx + 2 * k3vx + k4_dv_x);
  const newVelocityY = v.y + (h / 6) * (k1vy + 2 * k2vy + 2 * k3vy + k4_dv_y);
  const newVelocityZ = v.z + (h / 6) * (k1vz + 2 * k2vz + 2 * k3vz + k4_dv_z);
  const newVelocity = new THREE.Vector3(
    newVelocityX,
    newVelocityY,
    newVelocityZ
  );

  return {
    position: newPosition,
    velocity: newVelocity,
  };
}
