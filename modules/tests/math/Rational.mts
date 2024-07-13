import { describe, it } from "mocha";
import { Rational } from "../../math/Rational.mjs";
import { assert } from "chai";

describe("Rational.parse", () => {
	it("can correctly parse a rational number in the form a/b", () => {
		const rational = Rational.parse("-12/34");
		assert.equal(rational.numerator, -6);
		assert.equal(rational.denominator, 17);
	});
});
describe("Rational.isGreaterThan", () => {
	const testCases: [Rational, Rational][] = [
		[new Rational(1, 1), new Rational(2, 3)],
		[new Rational(3, 5), new Rational(3, 5)],
		[new Rational(-1, 2), new Rational(3, 5)],
		[new Rational(1, 2), new Rational(-3, 5)],
	];
	for(const [r1, r2] of testCases) {
		it(`correctly determines whether ${r1} > ${r2}`, () => {
			const actual = r1.isGreaterThan(r2);
			const expected = (r1.numerator / r1.denominator) > (r2.numerator / r2.denominator);
			assert.equal(actual, expected);
		});
	}
});
