import { describe, it } from "mocha";
import { PriorityQueue } from "../PriorityQueue.mjs";
import { assert } from "chai";

describe("PriorityQueue", () => {
	it("can insert elements with priority and pop the element with the lowest priority", () => {
		const queue = new PriorityQueue<string>();
		queue.insert("foo", 1);
		queue.insert("bar", 100);
		queue.insert("baz", 5);
		queue.insert("qux", 10);
		assert.equal(queue.pop(), "foo");
		assert.equal(queue.pop(), "baz");
		assert.equal(queue.pop(), "qux");
		assert.equal(queue.pop(), "bar");
	});
});
