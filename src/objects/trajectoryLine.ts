import { BufferGeometry } from "three";
import { BufferAttribute } from "three";
import { Color } from "three";
import { LineBasicMaterial } from "three";
import { Vector3 } from "three";
import { Line } from "three";

export class TrajectoryLine {
  public lineMesh: Line;

  private points: Vector3[] = [];
  private maxPoints: number = 10000;

  constructor() {
    // this.lineMesh = new Line(new LineGeometry(), new LineMaterial());

    const geometry = new BufferGeometry();

    const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 2 }); // linewidth قد لا يعمل في كل المتصفحات/المنصات

    this.lineMesh = new Line(geometry, material);
  }
  addPoint(position: Vector3): void {
    this.points.push(position.clone());

    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    const positionsArray = new Float32Array(this.points.length * 3);

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      positionsArray[i * 3] = p.x;
      positionsArray[i * 3 + 1] = p.y;
      positionsArray[i * 3 + 2] = p.z;
    }

    this.lineMesh.geometry.setAttribute(
      "position",
      new BufferAttribute(positionsArray, 3)
    );

    this.lineMesh.geometry.attributes.position.needsUpdate = true;
  }
  clear(): void {
    this.points = [];
    this.lineMesh.geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(), 3)
    );
    this.lineMesh.geometry.attributes.position.needsUpdate = true;
  }

  setColor(newColor: Color | number): void {
    if (this.lineMesh.material instanceof LineBasicMaterial) {
      this.lineMesh.material.color.set(newColor);
    }
  }
}
