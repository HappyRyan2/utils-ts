import { Direction } from "./geometry/Direction.mjs";
import { Rectangle } from "./geometry/Rectangle.mjs";
import { Vector } from "./geometry/Vector.mjs";
import { MathUtils } from "./math/MathUtils.mjs";

export class CanvasIO {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	parentElement: HTMLElement;
	keys: { [key: string]: boolean };
	mouse: {
		position: Vector,
		pressed: boolean,
		button: "right" | "left" | null
	}

	constructor(canvasID = "", canvasType = "fill-parent", parentElement = document.body) {
		this.canvas = document.createElement("canvas");
		this.canvas.id = canvasID;
		this.ctx = this.canvas.getContext("2d")!;
		this.parentElement = parentElement;

		this.keys = {};
		this.mouse = {
			position: new Vector(0, 0),
			pressed: false,
			button: null
		};

		this.attach();
		this.addEventListeners();
	}

	attach() {
		/* add the canvas to fill its parent element, and update the internal width / height of the canvas so that 1 canvas pixel = 1 on-screen pixel*/
		this.parentElement.appendChild(this.canvas);
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.parentElement.style.margin = "0px";
		this.parentElement.style.overflow = "hidden";

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		});
	}
	addEventListeners() {
		this.parentElement.addEventListener("keydown", (event) => {
			this.keys[event.code] = true;
		});
		this.parentElement.addEventListener("keyup", (event) => {
			this.keys[event.code] = false;
		});
		this.canvas.addEventListener("mousedown", (event) => {
			this.mouse.pressed = true;
			this.mouse.button = (event.button === 0) ? "left" : "right";
		});
		this.canvas.addEventListener("mouseup", (event) => {
			this.mouse.pressed = false;
			this.mouse.button = null;
		});
		this.canvas.addEventListener("mousemove", (event) => {
			const canvasRect = this.canvas.getBoundingClientRect();
			this.mouse.position.x = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * this.canvas.width
			this.mouse.position.y = (event.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * this.canvas.height;
		});
		this.canvas.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
	}


	width() {
		return this.canvas.getBoundingClientRect().width;
	}
	height() {
		return this.canvas.getBoundingClientRect().height;
	}
	boundingBox() {
		return new Rectangle(0, 0, this.width(), this.height());
	}


	strokeRect(rectangle: Rectangle) {
		this.ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}
	fillRect(rectangle: Rectangle) {
		this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}
	strokeLine(x1: number, y1: number, x2: number, y2: number) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}
	fillCanvas(color: string) {
		this.ctx.save();
		this.ctx.resetTransform();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width(), this.height());
		this.ctx.restore();
	}
	drawArrow(center: Vector, radius: number, direction: Direction) {
		const rotationAngles = {
			"right": 0,
			"down": 90,
			"left": 180,
			"up": 270
		};
		this.ctx.save();
		this.ctx.translate(center.x, center.y);
		this.ctx.rotate(MathUtils.toRadians(rotationAngles[direction]));
		this.ctx.beginPath();
		this.ctx.moveTo(radius, 0);
		this.ctx.lineTo(radius * Math.cos(MathUtils.toRadians(120)), radius * Math.sin(MathUtils.toRadians(120)));
		this.ctx.lineTo(radius * Math.cos(MathUtils.toRadians(240)), radius * Math.sin(MathUtils.toRadians(240)));
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}
	polygon(...points: number[] | Vector[]) {
		if(typeof points[0] === "number") {
			if(points.length % 2 !== 0) {
				throw new Error(`Cannot draw polygon; the number of coordinates provided must be an even number, but instead the coordinates list was [${points.join(", ")}].`);
			}
			if(points.length < 4) {
				throw new Error(`Cannot draw polygon; at least 2 points must be provided, but instead the coordinates list was [${points.join(", ")}].`);
			}
			const coordinates: number[] = points as number[];
			this.ctx.moveTo(coordinates[0], coordinates[1]);
			for(let i = 2; i + 1 < points.length; i += 2) {
				this.ctx.lineTo(coordinates[i], coordinates[i + 1]);
			}
			this.ctx.closePath();
		}
		else {
			const vectors: Vector[] = points as Vector[];
			this.polygon(...vectors.map(v => [v.x, v.y]).flat());
		}
	}
	moveTo(point: Vector) {
		this.ctx.moveTo(point.x, point.y);
	}
	lineTo(point: Vector) {
		this.ctx.lineTo(point.x, point.y);
	}
	arcTo(point1: Vector, point2: Vector, radius: number) {
		this.ctx.arcTo(point1.x, point1.y, point2.x, point2.y, radius);
	}
	fillPoly(...coordinates: number[] | Vector[]) {
		this.ctx.beginPath();
		this.polygon(...coordinates);
		this.ctx.fill();
	}
	fillCircle(x: number, y: number, radius: number) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
	}
	strokeCircle(x: number, y: number, radius: number) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.stroke();
	}
	gradientLine(x1: number, y1: number, x2: number, y2: number, innerColor: string, innerThickness: number, outerColor: string, totalThickness: number) {
		const mainPerpendicular = new Vector(x2, y2).subtract(new Vector(x1, y1)).normalize().rotate(90);
		for(const perpendicular of [mainPerpendicular, mainPerpendicular.multiply(-1)]) {
			const gradient = this.ctx.createLinearGradient(
				x1, y1,
				x1 + perpendicular.x * totalThickness, y1 + perpendicular.y * totalThickness
			);
			gradient.addColorStop(0, innerColor);
			gradient.addColorStop(innerThickness / totalThickness, innerColor);
			gradient.addColorStop(1, outerColor);
			this.ctx.fillStyle = gradient;
			this.fillPoly(
				new Vector(x1, y1).add(perpendicular.multiply(-1)),
				new Vector(x1, y1).add(perpendicular.multiply(totalThickness)),
				new Vector(x2, y2).add(perpendicular.multiply(totalThickness)),
				new Vector(x2, y2).add(perpendicular.multiply(-1))
			);
		}
		for(const [endpoint, direction] of [[new Vector(x1, y1), 1], [new Vector(x2, y2), -1]] as const) {
			const gradient = this.ctx.createRadialGradient(
				endpoint.x, endpoint.y, innerThickness,
				endpoint.x, endpoint.y, totalThickness
			);
			gradient.addColorStop(0, innerColor);
			gradient.addColorStop(1, outerColor);
			this.ctx.fillStyle = gradient;
			this.ctx.beginPath();
			this.ctx.arc(
				endpoint.x, endpoint.y, totalThickness, 
				Math.atan2(mainPerpendicular.y * direction, mainPerpendicular.x * direction),
				Math.atan2(-mainPerpendicular.y * direction, -mainPerpendicular.x * direction),
			);
			this.ctx.fill();
		}
	}

	static keyDirection(event: KeyboardEvent): Direction | null {
		if(event.key === "ArrowRight") { return "right"; }
		else if(event.key === "ArrowLeft") { return "left"; }
		else if(event.key === "ArrowUp") { return "up"; }
		else if(event.key === "ArrowDown") { return "down"; }
		else { return null; }
	}
}

const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
export const canvasIO = isBrowser() ? new CanvasIO() : null;
