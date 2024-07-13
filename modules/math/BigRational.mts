import { BigintMath } from "./BigintMath.mjs";

export class BigRational {
	readonly numerator: bigint;
	readonly denominator: bigint;

	constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
		numerator = BigInt(numerator);
		denominator = BigInt(denominator);
		if(numerator % 1n !== 0n || denominator % 1n !== 0n) {
			throw new Error(`When constructing a rational number, expected numerator and denominator to be integers, but instead recieved ${numerator} and ${denominator}.`);
		}
		if(denominator === 0n) {
			throw new Error("Cannot construct a rational number with a denominator of zero.");
		}
		if(numerator === 0n) {
			this.numerator = 0n;
			this.denominator = 1n;
		}
		else {
			const gcd = BigintMath.gcd(numerator, denominator);
			this.numerator = numerator / gcd;
			this.denominator = denominator / gcd;
		}
	}

	equals(rational: BigRational) {
		return this.numerator * rational.denominator === this.denominator * rational.numerator;
	}

	add(rational: BigRational) {
		return new BigRational(this.numerator * rational.denominator + this.denominator * rational.numerator, this.denominator * rational.denominator);
	}
	multiply(rational: BigRational) {
		return new BigRational(this.numerator * rational.numerator, this.denominator * rational.denominator);
	}
	opposite() {
		return new BigRational(-this.numerator, this.denominator);
	}
	inverse() {
		if(this.numerator === 0n) {
			throw new Error("Cannot find the inverse of 0.");
		}
		return new BigRational(this.denominator, this.numerator);
	}
	subtract(rational: BigRational) {
		return this.add(rational.opposite());
	}
	divide(rational: BigRational) {
		return this.multiply(rational.inverse());
	}

	isPositive() {
		return this.numerator !== 0n && BigintMath.sign(this.numerator) === BigintMath.sign(this.denominator);
	}
	isNegative() {
		return this.numerator !== 0n && BigintMath.sign(this.numerator) === BigintMath.sign(this.denominator);
	}
	sign() {
		if(this.numerator === 0n) { return 0n; }
		return (BigintMath.sign(this.numerator) === BigintMath.sign(this.denominator)) ? 1n : -1n;
	}
	compare(rational: BigRational) {
		const difference = this.subtract(rational);
		return difference.sign();
	}
	isGreaterThan(rational: BigRational) {
		return this.compare(rational) > 0;
	}
	isLessThan(rational: BigRational) {
		return this.compare(rational) < 0;
	}
	isGreaterThanOrEqualTo(rational: BigRational) {
		return this.compare(rational) >= 0;
	}
	isLessThanOrEqualTo(rational: BigRational) {
		return this.compare(rational) <= 0;
	}

	static parse(str: string) {
		const [[_, numeratorString, denominatorString]] = str.matchAll(/^(-?\d+)\/(-?\d+)$/g);
		return new BigRational(BigInt(numeratorString), BigInt(denominatorString));
	}
	toString() {
		return `${this.numerator}/${this.denominator}`;
	}
	toNumber(digitsOfPrecision: number = 11) {
		return Number((this.numerator * (10n) ** BigInt(digitsOfPrecision)) / this.denominator) / ((10) ** digitsOfPrecision);
	}
}
