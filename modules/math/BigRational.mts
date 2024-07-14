import { BigintMath } from "./BigintMath.mjs";

export class BigRational {
	readonly numerator: bigint;
	readonly denominator: bigint;

	constructor(numerator: bigint | number, denominator: bigint | number = 1n, simplify: boolean = true) {
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
		else if(simplify) {
			const gcd = BigintMath.gcd(numerator, denominator);
			this.numerator = numerator / gcd;
			this.denominator = denominator / gcd;
		}
		else {
			this.numerator = numerator;
			this.denominator = denominator;
		}
	}

	equals(rational: BigRational) {
		return this.numerator * rational.denominator === this.denominator * rational.numerator;
	}

	add(rational: BigRational, simplify = true) {
		return new BigRational(this.numerator * rational.denominator + this.denominator * rational.numerator, this.denominator * rational.denominator, simplify);
	}
	multiply(rational: BigRational, simplify = true) {
		return new BigRational(this.numerator * rational.numerator, this.denominator * rational.denominator, simplify);
	}
	opposite() {
		return new BigRational(-this.numerator, this.denominator, false);
	}
	inverse() {
		if(this.numerator === 0n) {
			throw new Error("Cannot find the inverse of 0.");
		}
		return new BigRational(this.denominator, this.numerator, false);
	}
	subtract(rational: BigRational, simplify = true) {
		return this.add(rational.opposite(), simplify);
	}
	divide(rational: BigRational, simplify = true) {
		return this.multiply(rational.inverse(), simplify);
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
		const difference = this.subtract(rational, false);
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
		return new BigRational(BigInt(numeratorString), BigInt(denominatorString), false);
	}
	toString() {
		return `${this.numerator}/${this.denominator}`;
	}
	toNumber(digitsOfPrecision: number = 11) {
		return Number((this.numerator * (10n) ** BigInt(digitsOfPrecision)) / this.denominator) / ((10) ** digitsOfPrecision);
	}
}
