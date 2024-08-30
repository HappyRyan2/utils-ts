import { assert } from "chai";
import { describe, it } from "mocha";
import { BigintMath } from "../../math/BigintMath.mjs";

describe("BigintMath.gcd", () => {
	it("returns the greatest common divisor of the two numbers", () => {
		assert.equal(BigintMath.gcd(36n, 84n), 12n);
	});
	it("works for another test case", () => {
		assert.equal(BigintMath.gcd(24n, 14n), 2n);
	});
});
describe("BigintMath.divideCeil", () => {
	it("works when the number is evenly divisible", () => {
		assert.equal(BigintMath.divideCeil(15n, 5n), 3n);
	});
	it("rounds up when the number is not evenly divisible", () => {
		assert.equal(BigintMath.divideCeil(16n, 5n), 4n);
	});
});
describe("BigintMath.floorSqrt", () => {
	it("correctly computes floor(sqrt(n)) and works for very big numbers", () => {
		const num = 10n ** 15n;
		assert.equal(BigintMath.floorSqrt(num ** 2n), num);
		assert.equal(BigintMath.floorSqrt(num ** 2n + 1n), num);
		assert.equal(BigintMath.floorSqrt((num + 1n) ** 2n - 1n), num);
		assert.equal(BigintMath.floorSqrt((num + 1n) ** 2n), num + 1n);
	});
});
