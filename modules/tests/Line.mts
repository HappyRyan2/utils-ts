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
describe("Line.contains", () => {
	it("returns whether the line contain the point", () => {
		const line = new Line(new Vector(1, 2), new Vector(3, 4));
		assert.isTrue(line.contains(new Vector(0, 1)));
		assert.isFalse(line.contains(new Vector(1, 1)));
	});
	it("works when the line is vertical", () => {
		const line = new Line(new Vector(1, 2), new Vector(1, 3));
		assert.isTrue(line.contains(new Vector(1, 4)));
		assert.isFalse(line.contains(new Vector(2, 3)));
	});
});

describe("Line.areCollinear", () => {
	it("returns true when the points are collinear", () => {
		assert.isTrue(Line.areCollinear([new Vector(1, 2), new Vector(4, 1), new Vector(7, 0)]));
	});
	it("returns false when the points are not collinear", () => {
		assert.isFalse(Line.areCollinear([new Vector(1, 2), new Vector(4, 1), new Vector(7, 1)]));
	});
});
describe("Line.isPerpendicularTo", () => {
	it("returns true when the lines are perpendicular", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 2));
		const line2 = new Line(new Vector(0, 0), new Vector(-2, 1));
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
	});
	it("returns false when the lines are not perpendicular", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 3));
		const line2 = new Line(new Vector(0, 0), new Vector(-2, 1));
		assert.isFalse(line1.isPerpendicularTo(line2));
		assert.isFalse(line2.isPerpendicularTo(line1));
	});
	it("works when the lines are vertical and horizontal", () => {
		const line1 = new Line(new Vector(0, 0), new Vector(1, 0));
		const line2 = new Line(new Vector(0, 0), new Vector(0, 1));
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
		assert.isFalse(line1.isPerpendicularTo(line1));
		assert.isFalse(line2.isPerpendicularTo(line2));
	});
});
