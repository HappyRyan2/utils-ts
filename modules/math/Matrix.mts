import { Field } from "./Field.mjs";

export class Matrix<FieldElementType> {
	width: number;
	height: number;
	field: Field<FieldElementType>;
	private rows: Map<number, Map<number, FieldElementType>>; // uses maps instead of arrays so we can only store nonzero entries (for high performance)

	constructor(width: number, height: number, field: Field<FieldElementType>, values: FieldElementType[][] = []) {
		this.field = field;
		this.width = width;
		this.height = height;
		this.rows = new Map();
		for(const [rowIndex, row] of values.entries()) {
			for(const [columnIndex, value] of row.entries()) {
				this.set(rowIndex, columnIndex, value);
			}
		}
	}
	get(row: number, column: number): FieldElementType {
		if(!this.rows.get(row)) { return this.field.zero; }
		return this.rows.get(row)!.get(column) ?? this.field.zero;
	}
	set(rowIndex: number, column: number, value: FieldElementType) {
		if(value === this.field.zero) {
			const row = this.rows.get(rowIndex);
			if(row) {
				row.delete(column);
				if(row.size === 0) {
					this.rows.delete(rowIndex);
				}
			}
		}
		else {
			let row = this.rows.get(rowIndex);
			if(!row) {
				this.rows.set(rowIndex, row = new Map());
			}
			row.set(column, value);
		}
	}
	private setInRow(row: Map<number, FieldElementType>, index: number, value: FieldElementType) {
		if(value === this.field.zero) {
			row.delete(index);
		}
		else {
			row.set(index, value);
		}
	}
	private setRow(row: Map<number, FieldElementType>, rowIndex: number) {
		if(row.size === 0) {
			this.rows.delete(rowIndex);
		}
		else {
			this.rows.set(rowIndex, row);
		}
	}

	// static multiply<FieldElementType>(matrix1: Matrix<FieldElementType>, matrix2: Matrix<FieldElementType>): Matrix<FieldElementType> {
	// 	if(matrix1.field !== matrix2.field) {
	// 		throw new Error("Cannot multiply matrices over different fields.");
	// 	}
	// 	if(matrix1.width !== matrix2.height) {
	// 		throw new Error(`In order to multiply matrices, the width of the first matrix must equal the height of the second, but in this case, the width of the first matrix was ${matrix1.width} whereas the height of the second matrix was ${matrix2.height}`);
	// 	}

	// 	const field = matrix1.field;
	// 	const result = new Matrix(matrix2.width, matrix1.height, field);
	// 	for(let rowIndex = )
	// }

	values(): FieldElementType[][] {
		const result: FieldElementType[][] = [];
		for(let rowIndex = 0; rowIndex < this.height; rowIndex ++) {
			result[rowIndex] = [];
			for(let columnIndex = 0; columnIndex < this.height; columnIndex ++) {
				result[rowIndex][columnIndex] = this.get(rowIndex, columnIndex);
			}
		}
		return result;
	}
	*nonzeroEntries(): Generator<[number, number, FieldElementType]> {
		for(const [rowIndex, row] of this.rows.entries()) {
			for(const [columnIndex, value] of row.entries()) {
				yield [rowIndex, columnIndex, value];
			}
		}
	}
	toString() {
		const lines: string[] = [];
		for(let y = 0; y < this.height; y ++) {
			let line = "";
			for(let x = 0; x < this.width; x ++) {
				const maxWidth = Math.max(...new Array(this.height).fill(0).map((v, i) => `${this.get(i, x)}`.length));
				const entry = `${this.get(y, x)}`;
				const numSpaces = (x === this.width - 1 ? 0 : maxWidth - entry.length + 1);
				line += (entry + " ".repeat(numSpaces));
			}
			lines.push(line);
		}
		return lines.join("\n");
	}
	copy() {
		return new Matrix(this.width, this.height, this.field, this.values());
	}

	static identity<FieldElementType>(field: Field<FieldElementType>, size: number) {
		const result = new Matrix(size, size, field);
		for(let i = 0; i < size; i ++) {
			result.set(i, i, field.one);
		}
		return result;
	}

	swapRows(rowIndex1: number, rowIndex2: number) {
		// Only swaps indices where one of the rows has a nonzero entry for performance reasons.
		// As a result, this runs in O(n) time, where n is the total number of nonzero entries in the two rows.
		const swappedIndices = new Set<number>();
		const row1 = this.rows.get(rowIndex1) ?? new Map<number, FieldElementType>();
		const row2 = this.rows.get(rowIndex2) ?? new Map<number, FieldElementType>();
		for(const [index, value] of row1.entries()) {
			this.setInRow(row1, index, row2.get(index) ?? this.field.zero);
			row2.set(index, value);
			swappedIndices.add(index);
		}
		for(const [index, value] of row2.entries()) {
			if(!swappedIndices.has(index)) {
				this.setInRow(row2, index, row1.get(index) ?? this.field.zero);
				row1.set(index, value);
			}
		}
		this.setRow(row1, rowIndex1);
		this.setRow(row2, rowIndex2);
	}
	multiplyRow(rowIndex: number, scalar: FieldElementType) {
		for(const [index, entry] of (this.rows.get(rowIndex) ?? new Map<number, FieldElementType>()).entries()) {
			this.set(rowIndex, index, this.field.multiply(entry, scalar));
		}
	}
	addScaledRow(sourceRowIndex: number, destinationRowIndex: number, scalar: FieldElementType) {
		for(const [index, entry] of (this.rows.get(sourceRowIndex) ?? new Map<number, FieldElementType>()).entries()) {
			const newValue = this.field.add(this.field.multiply(entry, scalar), this.get(destinationRowIndex, index));
			this.set(destinationRowIndex, index, newValue);
		}
	}
	inverse(): Matrix<FieldElementType> | null {
		/* Note: this modifies the matrix! (For performance reasons) */
		const copy = this.copy();
		const inverse = Matrix.identity(this.field, this.width);
		for(let i = 0; i < copy.height; i ++) {
			/* Swap rows if necessary to make the (i, i) entry nonzero */
			if(copy.get(i, i) === copy.field.zero) {
				let foundNonzeroEntry = false;
				for(let j = i + 1; j < copy.height; j ++) {
					if(copy.get(j, i) !== copy.field.zero) {
						copy.swapRows(i, j);
						inverse.swapRows(i, j);
						foundNonzeroEntry = true;
						break;
					}
				}
				if(!foundNonzeroEntry) { return null; }
			}

			inverse.multiplyRow(i, copy.field.inverse(copy.get(i, i)));
			copy.multiplyRow(i, copy.field.inverse(copy.get(i, i)));

			/* Add a scaled copy of row i to make all the entries below (i, i) equal to zero */
			for(let j = i + 1; j < copy.height; j ++) {
				inverse.addScaledRow(i, j, copy.field.opposite(copy.get(j, i)));
				copy.addScaledRow(i, j, copy.field.opposite(copy.get(j, i)));
			}
		}
		for(let i = copy.height - 1; i >= 0; i --) {
			/* Add a scaled copy of row i to make all the entries above (i, i) equal to zero */
			for(let j = i - 1; j >= 0; j --) {
				inverse.addScaledRow(i, j, copy.field.opposite(copy.get(j, i)));
				copy.addScaledRow(i, j, copy.field.opposite(copy.get(j, i)));
			}
		}
		return inverse;
	}
	subtract(matrix: Matrix<FieldElementType>) {
		for(const [row, column, value] of matrix.nonzeroEntries()) {
			this.set(row, column, this.field.subtract(this.get(row, column), value));
		}
		return this;
	}
}
