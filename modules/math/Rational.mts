import { MathUtils } from "./MathUtils.mjs";

export class Rational {
	readonly numerator: number;
	readonly denominator: number;

	constructor(numerator: number, denominator: number) {
		if(numerator % 1 !== 0 || denominator % 1 !== 0) {
			throw new Error(`When constructing a rational number, expected numerator and denominator to be integers, but instead recieved ${numerator} and ${denominator}.`);
		}
		if(denominator === 0) {
			throw new Error("Cannot construct a rational number with a denominator of zero.");
		}
		if(numerator === 0) {
			this.numerator = 0;
			this.denominator = 1;
		}
		else {
			const gcd = MathUtils.gcd(numerator, denominator);
			this.numerator = numerator / gcd;
			this.denominator = denominator / gcd;
		}
	}

	add(rational: Rational) {
		return new Rational(this.numerator * rational.denominator + this.denominator * rational.numerator, this.denominator * rational.denominator);
	}
	multiply(rational: Rational) {
		return new Rational(this.numerator * rational.numerator, this.denominator * rational.denominator);
	}
	opposite() {
		return new Rational(-this.numerator, this.denominator);
	}
	inverse() {
		if(this.numerator === 0) {
			throw new Error("Cannot find the inverse of 0.");
		}
		return new Rational(this.denominator, this.numerator);
	}
}