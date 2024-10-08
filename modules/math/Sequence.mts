import { MathUtils } from "./MathUtils.mjs";

export class Sequence {
	/*
	Represents an increasing infinite sequence of numbers, indexed starting at 0.
	Some methods may not work properly or may loop forever if the sequence is not ascending, or if the sequence is eventually constant.
	*/

	private readonly unmemoizedTerms: (Generator<number, never>) | null;
	private readonly unmemoizedGetTerm: ((index: number) => number) | null;
	private readonly cachedTerms: Map<number, number> = new Map();

	constructor(func: (() => Generator<number, never>) | ((index: number) => number)) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		if(func instanceof GeneratorFunction) {
			this.unmemoizedTerms = (func as () => Generator<number, never>)();
			this.unmemoizedGetTerm = null;
		}
		else {
			this.unmemoizedTerms = null;
			this.unmemoizedGetTerm = func as ((index: number) => number);
		}
	}

	getTerm(index: number) {
		if(this.cachedTerms.has(index)) {
			return this.cachedTerms.get(index)!;
		}
		else if(this.unmemoizedGetTerm) {
			const result = this.unmemoizedGetTerm(index);
			this.cachedTerms.set(index, result);
			return result;
		}
		else {
			while(!this.cachedTerms.has(index)) {
				const nextTerm = this.unmemoizedTerms!.next().value;
				this.cachedTerms.set(this.cachedTerms.size, nextTerm);
			}
			return this.cachedTerms.get(index)!;
		}
	}
	*entries() {
		for(let index = 0; index < Infinity; index ++) {
			yield [index, this.getTerm(index)];
		}
	}
	*[Symbol.iterator]() {
		for(let index = 0; index < Infinity; index ++) {
			yield this.getTerm(index);
		}
	}
	slice(startIndex: number, endIndex: number, startMode: "inclusive" | "exclusive" = "inclusive", endMode: "inclusive" | "exclusive" = "exclusive") {
		const result = [];
		for(let index = (startMode === "inclusive") ? startIndex : startIndex + 1; (endMode === "inclusive") ? (index <= endIndex) : (index < endIndex); index ++) {
			result.push(this.getTerm(index));
		}
		return result;
	}


	static POSITIVE_INTEGERS = new Sequence(n => n + 1);
	static NONNEGATIVE_INTEGERS = new Sequence(n => n);
	static PRIMES = new Sequence(function*() {
		yield 2;
		yield 3;
		const primes = [2, 3];
		outerLoop: for(let num = 5; true; num += (num % 6 === 5) ? 2 : 4) {
			for(const prime of primes) {
				if(num % prime === 0) {
					continue outerLoop;
				}
				if(prime ** 2 > num) { break; }
			}
			primes.push(num);
			yield num;
		}
	});


	/*
	-----------------------------------------------
	Methods that assume the sequence is increasing:
	-----------------------------------------------
	*/
	*termsBelow(upperBound: number, mode: "inclusive" | "exclusive" = "inclusive") {
		for(const [index, term] of this.entriesBelow(upperBound, mode)) {
			yield term;
		}
	}
	*entriesBelow(upperBound: number, mode: "inclusive" | "exclusive") {
		yield* this.entriesBetween(-Infinity, upperBound, "inclusive", mode);
	}
	*termsBetween(lowerBound: number, upperBound: number, lowerMode: "inclusive" | "exclusive" = "inclusive", upperMode: "inclusive" | "exclusive" = "exclusive") {
		for(const [index, term] of this.entriesBetween(lowerBound, upperBound, lowerMode, upperMode)) {
			yield term;
		}
	}
	*entriesBetween(lowerBound: number, upperBound: number, lowerMode: "inclusive" | "exclusive" = "inclusive", upperMode: "inclusive" | "exclusive" = "exclusive") {
		for(const [index, term] of this.entries()) {
			if((upperMode === "inclusive" && term > upperBound) || (upperMode === "exclusive" && term >= upperBound)) {
				return;
			}
			if((lowerMode === "inclusive" && term >= lowerBound) || (lowerMode === "exclusive" && term > lowerBound)) {
				yield [index, term];
			}
		}
	}
	includes(term: number) {
		for(const [i, num] of this.entries()) {
			if(num === term) { return true; }
			if(num > term) { return false; }
		}
		return false;
	}

	/*
	------------------------------------------------------------
	Methods that assume the sequence is positive and increasing:
	------------------------------------------------------------
	*/
	*setsWithSum(sum: number, setSize?: number): Generator<number[]> {
		if(setSize == undefined) {
			for(let size = 0; size <= sum; size ++) {
				yield* this.setsWithSum(sum, size);
			}
		}
		else if(setSize === 0 && sum === 0) {
			yield [];
		}
		else if(setSize !== 0) {
			for(const [index, firstTerm] of this.entriesBelow(sum, "inclusive")) {
				for(const set of new Sequence(n => this.getTerm(n + index + 1)).setsWithSum(sum - firstTerm, setSize - 1)) {
					yield [firstTerm, ...set];
				}
			}
		}
	}
	*multisetsWithSum(sum: number, setSize?: number): Generator<number[]> {
		if(setSize == undefined) {
			for(let size = 0; size <= sum; size ++) {
				yield* this.multisetsWithSum(sum, size);
			}
		}
		else if(setSize === 0 && sum === 0) {
			yield [];
		}
		else if(setSize !== 0) {
			for(const [index, firstTerm] of this.entriesBelow(sum, "inclusive")) {
				for(const set of new Sequence(n => this.getTerm(n + index)).multisetsWithSum(sum - firstTerm, setSize - 1)) {
					yield [firstTerm, ...set];
				}
			}
		}
	}
	*tuplesWithSum(sum: number, tupleSize?: number): Generator<number[]> {
		if(tupleSize == undefined) {
			for(let size = 0; size <= sum; size ++) {
				yield* this.tuplesWithSum(sum, size);
			}
		}
		else if(tupleSize === 0 && sum === 0) {
			yield [];
		}
		else if(tupleSize >= 1) {
			for(const firstTerm of this.termsBelow(sum, "inclusive")) {
				for(const tuple of this.tuplesWithSum(sum - firstTerm, tupleSize - 1)) {
					yield [firstTerm, ...tuple];
				}
			}
		}
	}
	numMultisetsWithSum(sum: number, setSize?: number): number {
		if(setSize == undefined) {
			let result = 0;
			for(let size = 0; size <= sum; size ++) {
				result += this.numMultisetsWithSum(sum, size);
			}
			return result;
		}
		else if(setSize === 0 && sum === 0) {
			return 1;
		}
		else if(setSize !== 0) {
			let result = 0;
			for(const [index, firstTerm] of this.entriesBelow(sum, "inclusive")) {
				result += new Sequence(n => this.getTerm(n + index)).numMultisetsWithSum(sum - firstTerm, setSize - 1);
			}
			return result;
		}
		else {
			return 0;
		}
	}
}
