import { assert } from "chai";
import { describe, it } from "mocha";
import { HashSet } from "../HashSet.mjs";

describe("HashSet.has", () => {
	it("can return whether the set has a value whose hash is equal to the given value", () => {
		const set = new HashSet([[1, 2]]);
		assert.isTrue(set.has([1, 2]));
		assert.isFalse(set.has([2, 3]));
	});
});
describe("HashSet.size", () => {
	it("returns the number of elements in the set", () => {
		const set = new HashSet([[1, 2], [3, 4], [5]]);
		assert.equal(set.size, 3);
	});
});
describe("HashSet.add", () => {
	it("can add elements to the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		assert.isTrue(set.has([1, 2]));
		assert.isFalse(set.has([2, 3]));
	});
	it("does not add duplicate elements to the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		set.add([1, 2]);
		set.add([1, 2]);
		assert.equal(set.size, 1);
	});
	it("keeps the previous value if a duplicate is added", () => {
		const obj1 = { foo: "a", bar: "b" };
		const obj2 = { foo: "a", bar: "c" };
		const set = new HashSet<{ foo: string, bar: string }>([], obj => obj.foo);
		set.add(obj1);
		assert.isTrue(set.has(obj1));
		assert.isTrue(set.has(obj2));
		set.add(obj2);
		assert.isTrue(set.has(obj1));
		assert.isTrue(set.has(obj2));
		assert.equal(set.size, 1);
		assert.sameOrderedMembers([...set], [obj1]);
	});
});
describe("HashSet.delete", () => {
	it("can delete elements from the set", () => {
		const set = new HashSet([[1, 2], [3, 4]]);
		set.delete([1, 2]);
		assert.isFalse(set.has([1, 2]));
		assert.equal(set.size, 1);
	});
});
describe("HashSet iterator", () => {
	it("can iterate over the elements of the set", () => {
		const set = new HashSet();
		set.add([1, 2]);
		set.add([3]);
		const values = [...set];
		assert.sameDeepOrderedMembers(values, [[1, 2], [3]]);
	});
});
