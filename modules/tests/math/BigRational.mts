import { assert } from "chai";
import { BigRational } from "../../math/BigRational.mjs";
import { describe, it } from "mocha";

describe("BigRational.toNumber", () => {
	it("converts the rational to a number", () => {
		const rational = new BigRational(
			12345000000000000000000000000n,
			10000000000000000000000000000n,
		);
		const num = rational.toNumber(11);
		assert.equal(num, 1.2345);
	});
});
