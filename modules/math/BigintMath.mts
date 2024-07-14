export class BigintMath {
	static max(...values: bigint[]) {
		let max = values[0];
		for(const value of values) {
			if(value > max) {
				max = value;
			}
		}
		return max;
	}
	static min(...values: bigint[]) {
		let min = values[0];
		for(const value of values) {
			if(value < min) {
				min = value;
			}
		}
		return min;
	}
	static abs(value: bigint) {
		return (value < 0n) ? -value : value;
	}
	static sign(value: bigint) {
		if(value === 0n) {
			return 0n;
		}
		return (value > 0) ? 1n : -1n;
	}
	private static recursiveGCD(num1: bigint, num2: bigint): bigint {
		if(num1 % num2 === 0n) { return num2; }
		return BigintMath.recursiveGCD(num2, num1 % num2);
	}
	static gcd(num1: bigint, num2: bigint): bigint {
		if(num1 === 0n || num2 === 0n) { throw new Error("Cannot calculate GCD when either of the inputs are zero."); }
		[num1, num2] = [BigintMath.max(BigintMath.abs(num1), BigintMath.abs(num2)), BigintMath.min(BigintMath.abs(num1), BigintMath.abs(num2))];
		return BigintMath.recursiveGCD(num1, num2);
	}
}
