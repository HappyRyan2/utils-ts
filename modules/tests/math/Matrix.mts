import { assert } from "chai";
import { Matrix } from "../../math/Matrix.mjs";
import { Field } from "../../math/Field.mjs";
import { describe, it } from "mocha";
import { Rational } from "../../math/Rational.mjs";

describe("Matrix.fromFunction", () => {
	it("can construct a matrix from a function that outputs the value at each (row, column) entry", () => {
		const matrix = Matrix.fromFunction(3, 3, (row, column) => row - column, Field.REALS);
		assert.deepEqual(matrix.values(), [
			[0, -1, -2],
			[1, 0, -1],
			[2, 1, 0],
		]);
	});
});
describe("Matrix.values", () => {
	it("returns the values as a 2D array, and works when the matrix is not square", () => {
		const matrix = new Matrix(3, 2, Field.REALS, [
			[1, 2, 4],
			[0, -6, -12],
		]);
		const values = matrix.values();
		assert.deepEqual(values, [
			[1, 2, 4],
			[0, -6, -12],
		]);
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
describe("Matrix.addScaledRow", () => {
	it("can add a scaled copy of one row to another, and works when the matrix is not square", () => {
		const matrix = new Matrix(3, 2, Field.REALS, [
			[1, 2, 4],
			[3, 0, 0],
		]);
		matrix.addScaledRow(0, 1, -3);
		assert.deepEqual(matrix.values(), [
			[1, 2, 4],
			[0, -6, -12],
		]);
	});
});
describe("Matrix.rowEchelonForm", () => {
	it("can correctly calculate the reduced row echelon form", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[0, 2, 0],
			[0, 0, 3],
			[1, 0, 0],
		]);
		const rref = matrix.rowEchelonForm(true);
		assert.deepEqual(rref.values(), [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1],
		]);
	});
	it("works for a matrix that is wider than it is tall", () => {
		const matrix = new Matrix(3, 2, Field.REALS, [
			[1, 2, 4],
			[3, 0, 0],
		]);
		const rref = matrix.rowEchelonForm(true);
		assert.deepEqual(rref.values(), [
			[1, 0, 0],
			[0, 1, 2],
		]);
	});
});
describe("Matrix.rank", () => {
	it("returns 0 for the zero matrix", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 0);
	});
	it("returns 4 for the 4-by-4 identity matrix", () => {
		const matrix = Matrix.identity(Field.REALS, 4);
		const rank = matrix.rank();
		assert.equal(rank, 4);
	});
	it("returns 3 for a 3-by-3 invertible matrix", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[0, 2, 0],
			[0, 0, 3],
			[1, 0, 0],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 3);
	});
	it("returns 2 for a 3x3 matrix where exactly two of the columns are scalar multiples of each other", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 2, 10],
			[3, 4, 30],
			[5, 6, 50],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 2);
	});
	it("returns 1 for a 3x3 matrix where all the columns are scalar multiples of each other", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 10, 100],
			[2, 20, 200],
			[3, 30, 300],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 1);
	});
	it("returns 2 for a 2x3 matrix where the two rows are not scalar multiples of each other", () => {
		const matrix = new Matrix(3, 2, Field.REALS, [
			[1, 2, 4],
			[3, 0, 0],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 2);
	});
	it("returns 0 for a non-square matrix with all zero entries", () => {
		const matrix = new Matrix(4, 3, Field.REALS, [
			[0, 0, 0],
			[0, 0, 0],
		]);
		const rank = matrix.rank();
		assert.equal(rank, 0);
	});
});
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
	it("does not modify the original matrix", () => {
		const matrix = new Matrix(3, 3, Field.REALS, [
			[1, 0, 0],
			[0, 2, 0],
			[0, 0, 3],
		]);
		matrix.inverse();
		assert.deepEqual(matrix.values(), [
			[1, 0, 0],
			[0, 2, 0],
			[0, 0, 3],
		]);
	});
	it("works when the field element types have a custom equality method", () => {
		const matrix = new Matrix(3, 3, Field.RATIONALS, [
			[new Rational(0), new Rational(2), new Rational(0)],
			[new Rational(0), new Rational(0), new Rational(3)],
			[new Rational(1), new Rational(0), new Rational(0)],
		]);
		const inverse = matrix.inverse();
		assert.isNotNull(inverse);
		assert.deepEqual(inverse!.values(), [
			[new Rational(0), new Rational(0), new Rational(1)],
			[new Rational(1, 2), new Rational(0), new Rational(0)],
			[new Rational(0), new Rational(1, 3), new Rational(0)],
		]);
	});
});
