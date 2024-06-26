import { assert } from "chai";
import { describe, it } from "mocha";
import { Sequence } from "../../math/Sequence.mjs";

describe("Sequence.getTerm", () => {
	it("can return the nth term of a sequence given by an explicit formula, and uses memoization", () => {
		let timesCalled = 0;
		const sequence = new Sequence(n => {
			timesCalled ++;
			return n * n;
		});
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(timesCalled, 1);
	});
	it("can return the nth term of a sequence given by a generator function, and uses memoization", () => {
		let timesYielded = 0;
		const powersOf2 = new Sequence(function*() {
			let num = 1;
			while(true) {
				timesYielded ++;
				yield num;
				num *= 2;
			}
		});
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(timesYielded, 6);

		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(timesYielded, 8);

		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(timesYielded, 8);
	});
});
describe("Sequence.entriesBelow", () => {
	it("can yield all the terms and indices such that the term is less than or equal to the given maximum", () => {
		const sequence = new Sequence(n => 2 ** n); // 1, 2, 4, 8, ...
		const entries = [...sequence.entriesBelow(16, "inclusive")];
		assert.deepEqual(entries, [
			[0, 1], 
			[1, 2], 
			[2, 4], 
			[3, 8],
			[4, 16]
		]);
	});
	it("can yield all the terms and indices such that the term is strictly less than the given maximum", () => {
		const sequence = new Sequence(n => 2 ** n); // 1, 2, 4, 8, ...
		const entries = [...sequence.entriesBelow(16, "exclusive")];
		assert.deepEqual(entries, [
			[0, 1], 
			[1, 2], 
			[2, 4], 
			[3, 8]
		]);
	});
});
describe("Sequence.entriesBetween", () => {
	it("works when both modes are inclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "inclusive", "inclusive")];
		assert.deepEqual(entries, [
			[3, 9],
			[4, 16],
			[5, 25]
		]);
	});
	it("works when lowerMode is inclusive and upperMode is exclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "inclusive", "exclusive")];
		assert.deepEqual(entries, [
			[3, 9],
			[4, 16]
		]);
	});
	it("works when lowerMode is exclusive and upperMode is inclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "exclusive", "inclusive")];
		assert.deepEqual(entries, [
			[4, 16],
			[5, 25],
		]);
	});
	it("works when both modes are exclusive", () => {
		const sequence = new Sequence(n => n ** 2); // 0, 1, 4, 9, ...
		const entries = [...sequence.entriesBetween(9, 25, "exclusive", "exclusive")];
		assert.deepEqual(entries, [
			[4, 16]
		]);
	});
});
describe("Sequence.setsWithSum", () => {
	it("returns all the sets of elements of the sequence that add up to the given value, sorted in ascending order", () => {
		const sequence = new Sequence(n => n);
		const sets = [...sequence.setsWithSum(2, 6)];
		assert.sameDeepMembers(sets, [
			[0, 6],
			[1, 5],
			[2, 4],
		]);
	});
});
describe("Sequence.multisetsWithSum", () => {
	it("can return the set of all sets of 2 positive integers that sum to 6", () => {
		const POSITIVE_INTEGERS = new Sequence(n => n + 1);
		const sets = [...POSITIVE_INTEGERS.multisetsWithSum(2, 6)];
		assert.sameDeepMembers(sets, [
			[1, 5],
			[2, 4],
			[3, 3]
		]);
	});
});
