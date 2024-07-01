import { assert } from "chai";
import { Tree } from "../../math/Tree.mjs";
import { describe, it } from "mocha";

describe("Tree.leaves", () => {
	it("iterates through the leaves of the tree", () => {
		const ALPHABET = ["A", "B", "C"];
		const getChildren = (str: string) => {
			if(str.length < 3) {
				return ALPHABET.map(char => str + char);
			}
			else { return []; }
		};
		const rootNode = "A";
		const results: string[] = [];
		for(const str of Tree.leaves(rootNode, getChildren)) {
			results.push(str);
		}
		assert.sameOrderedMembers(results, [
			"AAA",
			"AAB",
			"AAC",
			"ABA",
			"ABB",
			"ABC",
			"ACA",
			"ACB",
			"ACC",
		]);
	});
	it("works when the root is the only leaf", () => {
		const results = [...Tree.leaves(0, () => [])];
		assert.sameMembers(results, [0]);
	});
});
describe("Tree.nodesWithAncestors", () => {
	it("iterates through all nodes in the tree, yielding the node and its list of ancestors (including itself and the root)", () => {
		const ALPHABET = ["A", "B", "C"];
		const getChildren = (str: string) => {
			if(str.length < 3) {
				return ALPHABET.map(char => str + char);
			}
			else { return []; }
		};
		const rootNode = "A";
		const results: { node: string, ancestors: string[] }[] = [];
		for(const value of Tree.nodesAndAncestors(rootNode, getChildren)) {
			results.push(value);
		}
		assert.sameDeepOrderedMembers(results, [
			{ node: "A", ancestors: ["A"] },
			{ node: "AA", ancestors: ["A", "AA"] },
			{ node: "AAA", ancestors: ["A", "AA", "AAA"] },
			{ node: "AAB", ancestors: ["A", "AA", "AAB"] },
			{ node: "AAC", ancestors: ["A", "AA", "AAC"] },
			{ node: "AB", ancestors: ["A", "AB"] },
			{ node: "ABA", ancestors: ["A", "AB", "ABA"] },
			{ node: "ABB", ancestors: ["A", "AB", "ABB"] },
			{ node: "ABC", ancestors: ["A", "AB", "ABC"] },
			{ node: "AC", ancestors: ["A", "AC"] },
			{ node: "ACA", ancestors: ["A", "AC", "ACA"] },
			{ node: "ACB", ancestors: ["A", "AC", "ACB"] },
			{ node: "ACC", ancestors: ["A", "AC", "ACC"] },
		]);
	});
});
