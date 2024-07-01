import { assert } from "chai";
import { Matrix } from "../../math/Matrix.mjs";
import { Field } from "../../math/Field.mjs";
import { describe, it } from "mocha";

describe("Matrix.inverse", () => {
	it("correctly calculates the inverse of a 2x2 matrix over a finite field", () => {
		const field = Field.integersModulo(11);
		const matrix = new Matrix(2, 2, field, [[3, 5], [1, 2]]);
		const inverse = matrix.inverse();
		assert.isNotNull(inverse);
		assert.deepEqual(inverse!.values(), [
			[2, 11-5],
			[11-1, 3],
		]);
	});
	it("correctly calculates the inverse of a 3x3 matrix with lots of zero entries", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[0, 2, 0],
			[0, 0, 3],
			[1, 0, 0],
		]);
		const inverse = matrix.inverse();
		assert.isNotNull(inverse);
		assert.deepEqual(inverse!.values(), [
			[0, 0, 1],
			[1/2, 0, 0],
			[0, 1/3, 0],
		]);
	});
	it("correctly calculates the inverse of a diagonal matrix", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 0, 0],
			[0, 2, 0],
			[0, 0, 3],
		]);
		const inverse = matrix.inverse();
		assert.isNotNull(inverse);
		assert.deepEqual(inverse!.values(), [
			[1, 0, 0],
			[0, 1/2, 0],
			[0, 0, 1/3],
		]);
	});
	it("returns null if any of the columns are equal", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 2, 1],
			[3, 4, 3],
			[5, 6, 5],
		]);
		assert.isNull(matrix.inverse());
	});
	it("returns null if any of the columns are scalar multiples of each other", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 2, 10],
			[3, 4, 30],
			[5, 6, 50],
		]);
		assert.isNull(matrix.inverse());
	});
	it("returns null if any of the columns are linearly dependent", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 2, 3],
			[3, 4, 7],
			[5, 6, 11],
		]);
		assert.isNull(matrix.inverse());
	});
	it("returns null for the zero matrix", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		]);
		assert.isNull(matrix.inverse());
	});
});
describe("Matrix.swapRows", () => {
	it("correctly swaps the rows", () => {
		const matrix = new Matrix(2, 2, Field.REALS, [[1, 2], [3, 4]]);
		matrix.swapRows(0, 1);
		assert.deepEqual(matrix["rows"], new Map([
			[0, new Map([[0, 3], [1, 4]])],
			[1, new Map([[0, 1], [1, 2]])],
		]));
	});
	it("does not set zero entries, and does not set empty rows", () => {
		const matrix = new Matrix(2, 2, Field.REALS, [[0, 123], [0, 0]]);
		matrix.swapRows(0, 1);
		assert.deepEqual(matrix["rows"], new Map([
			[1, new Map([[1, 123]])],
		]));
	});
});
describe("Matrix.toString", () => {
	it("converts the matrix to a multiline string, adding spacing so that all the columns line up", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 2, 3],
			[400000, 5, 6],
			[7, 8, 9],
		]);
		assert.equal(matrix.toString(), "1      2 3\n400000 5 6\n7      8 9");
	});
});
