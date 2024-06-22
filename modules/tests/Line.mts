import { describe, it } from "mocha";
import { Line } from "../geometry/Line.mjs";
import { Vector } from "../geometry/Vector.mjs";
import { assert } from "chai";

describe("Line.getX", () => {
	it("returns the x-value such that (x, y) is on the line, where y is the given y-value", () => {
		const line = new Line(new Vector(2, 1), new Vector(3, 3));
		const x = line.getX(7);
		assert.equal(x, 5);
	});
});
describe("Line.getY", () => {
	it("returns the y-value such that (x, y) is on the line, where x is the given x-value", () => {
		const line = new Line(new Vector(1, 2), new Vector(3, 3));
		const x = line.getY(7);
		assert.equal(x, 5);
	});
});
