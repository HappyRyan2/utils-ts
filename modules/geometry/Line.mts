import { Vector } from "./Vector.mjs";

export class Line {
	endpoint1: Vector;
	endpoint2: Vector;

	constructor(endpoint1: Vector, endpoint2: Vector) {
		this.endpoint1 = endpoint1;
		this.endpoint2 = endpoint2;
	}

	getX(y: number) {
		return this.endpoint1.x + ((y - this.endpoint1.y) / (this.endpoint2.y - this.endpoint1.y) * (this.endpoint2.x - this.endpoint1.x));
	}
	getY(x: number) {
		return this.endpoint1.y + ((x - this.endpoint1.x) / (this.endpoint2.x - this.endpoint1.x) * (this.endpoint2.y - this.endpoint1.y));
	}

	scale(num: number) {
		return new Line(this.endpoint1.multiply(num), this.endpoint2.multiply(num));
	}

	isHorizontal() {
		return this.endpoint1.y === this.endpoint2.y;
	}
	isVertical() {
		return this.endpoint1.x === this.endpoint2.x;
	}

	contains(point: Vector) {
		if(this.isVertical()) {
			return point.x === this.endpoint1.x;
		}
		return this.getY(point.x) === point.y;
	}
}
