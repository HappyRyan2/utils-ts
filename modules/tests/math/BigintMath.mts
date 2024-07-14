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
