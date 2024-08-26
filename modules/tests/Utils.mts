import { describe, it } from "mocha";
import { Utils } from "../Utils.mjs";
import { assert } from "chai";

describe("Utils.cartesianProduct", () => {
	it("returns the set of all ordered tuples that can be obtained by choosing one element from each set", () => {
		const pairs = [...Utils.cartesianProduct([1, 2], ["a", "b"])];
		assert.sameDeepMembers(pairs, [
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"],
		]);
	});
});
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

			[3, 4],
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

			[3, 4],
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

			[4, 4],
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

			[3, 4],
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
describe("Utils.memoize", () => {
	it("returns a memoized version of the given function", () => {
		let timesRun = 0;
		const add = (a: number, b: number) => {
			timesRun ++;
			return a + b;
		};
		const memoizedAdd = Utils.memoize(add);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(memoizedAdd(1, 2), 3);
		assert.equal(timesRun, 1);
	});
	it("can first convert the arguments to a standard form", () => {
		let timesRun = 0;
		const modularAdd = (a: number, b: number) => {
			timesRun ++;
			return (a + b) % 10;
		};
		const standardizeArgs = (a: number, b: number) => [a % 10, b % 10] as [number, number];

		const memoized = Utils.memoize(modularAdd, standardizeArgs);
		assert.equal(memoized(1, 2), 3);
		assert.equal(memoized(1001, 2), 3);
		assert.equal(memoized(1, 1002), 3);
		assert.equal(memoized(3001, 4002), 3);
		assert.equal(timesRun, 1);
	});
	it("should stringify arguments in a way that doesn't cause collisions due to concatenation", () => {
		let timesRun = 0;
		const add = (a: number, b: number) => {
			timesRun ++;
			return a + b;
		};
		const memoizedAdd = Utils.memoize(add);

		assert.equal(memoizedAdd(1, 23), 24);
		assert.equal(memoizedAdd(12, 3), 15);
		assert.equal(timesRun, 2);
	});
	it("calls the function with the correct this value", () => {
		const obj = {
			func: function() { return this; },
		};
		obj.func = Utils.memoize(obj.func);
		assert.equal(obj.func(), obj);
	});
});
describe("Utils.minEntry", () => {
	it("can return the triple [index, value, output] at which the minimum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const minEntry = Utils.minEntry(array, str => str.length);
		assert.sameOrderedMembers(minEntry, [1, "ab", 2]);
	});
	it("can return the triple [index, value, output] for the minimum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const minEntry = Utils.minEntry(array);
		assert.sameOrderedMembers(minEntry, [1, 20, 20]);
	});
});
describe("Utils.maxEntry", () => {
	it("can return the triple [index, value, output] at which the maximum value of the callback is attained", () => {
		const array = ["abc", "ab", "abcd"];
		const maxEntry = Utils.maxEntry(array, str => str.length);
		assert.sameOrderedMembers(maxEntry, [2, "abcd", 4]);
	});
	it("can return the triple [index, value, value] for the maximum entry of a list of numbers without being given a callback", () => {
		const array = [300, 20, 4000];
		const maxEntry = Utils.maxEntry(array);
		assert.sameOrderedMembers(maxEntry, [2, 4000, 4000]);
	});
});
describe("Utils.subsets", () => {
	it("can yield all the subsets of the given set that have the given size", () => {
		const result = [...Utils.subsets(["a", "b", "c", "d"], 2)];
		assert.sameDeepMembers(result, [
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
	it("can yield a list of all the subsets when the size parameter is omitted", () => {
		const result = [...Utils.subsets(["a", "b", "c"])];
		assert.sameDeepMembers(result, [
			new Set([]),
			new Set(["a"]),
			new Set(["b"]),
			new Set(["c"]),
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["b", "c"]),
			new Set(["a", "b", "c"]),
		]);
	});
});
