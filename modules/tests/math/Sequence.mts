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
describe("Sequence.setsWithSum", () => {
	it("returns all the sets of elements of the sequence that add up to the given value, sorted in ascending order", () => {
		const sequence = new Sequence(n => n);
		const sets = [...sequence.setsWithSum(2, 5)];
		assert.sameDeepMembers(sets, [
			[0, 5],
			[1, 4],
			[2, 3],
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
