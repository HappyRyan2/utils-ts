import { describe, it } from "mocha";
import { Utils } from "../Utils.mjs";
import { assert } from "chai";

describe("Utils.combinations", () => {
	it("can return all the tuples of distinct items", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "all-distinct", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
		]);
	});
	it("can return all the tuples of items, limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "allow-duplicates", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 2],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
		]);
	});
	it("can return all the tuples of items, not limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const tuples = [...Utils.combinations(items, 2, "unlimited-duplicates", "tuples")];
		assert.sameDeepOrderedMembers(tuples, [
			[1, 1],
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 1],
			[2, 2],
			[2, 3],
			[2, 4],

			[3, 1],
			[3, 2],
			[3, 3],
			[3, 4],

			[4, 1],
			[4, 2],
			[4, 3],
			[4, 4],
		]);
	});

	it("can return all the sets of distinct items", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "all-distinct", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 2],
			[1, 3],
			[1, 4],

			[2, 3],
			[2, 4],

			[3, 4]
		]);
	});
	it("can return all the multisets of items, limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "allow-duplicates", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 2],
			[1, 3],
			[1, 4],
	
			[2, 2],
			[2, 3],
			[2, 4],
	
			[3, 4]
		]);
	});
	it("can return all the multisets of items, not limited by the number of copies in the given list", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 2, "unlimited-duplicates", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1, 1],
			[1, 2],
			[1, 3],
			[1, 4],
	
			[2, 2],
			[2, 3],
			[2, 4],
	
			[3, 3],
			[3, 4],

			[4, 4]
		]);
	});
	it("can return all the sets of distinct items with size in a given range", () => {
		const items = [1, 2, 2, 3, 4];
		const sets = [...Utils.combinations(items, 1, 2, "all-distinct", "sets")];
		assert.sameDeepOrderedMembers(sets, [
			[1],
			[2],
			[3],
			[4],

			[1, 2],
			[1, 3],
			[1, 4],

			[2, 3],
			[2, 4],

			[3, 4]
		]);
	});
});
describe("Utils.range", () => {
	it("can return a range of numbers with a given step, including both endpoints", () => {
		const range = Utils.range(3, 9, "inclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7, 9]);
	});
	it("can return a range of numbers with a given step, excluding both endpoints", () => {
		const range = Utils.range(3, 9, "exclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [5, 7]);
	});
	it("can return a range of numbers with a given step, including the start but excluding the end", () => {
		const range = Utils.range(3, 9, "inclusive", "exclusive", 2);
		assert.sameOrderedMembers(range, [3, 5, 7]);
	});
	it("can return a range of numbers with a given step, excluding the start but including the end", () => {
		const range = Utils.range(3, 9, "exclusive", "inclusive", 2);
		assert.sameOrderedMembers(range, [5, 7, 9]);
	});
});
