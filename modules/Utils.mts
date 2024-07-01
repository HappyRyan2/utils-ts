type DuplicateMode = "all-distinct" | "allow-duplicates" | "unlimited-duplicates";
type OrderMode = "tuples" | "sets";

export class Utils {
	static randomItem<T>(items: Array<T>) {
		const index = Math.floor(Math.random() * items.length);
		return items[index];
	}
	static randomIndex<T>(items: Array<T>) {
		const index = Math.floor(Math.random() * items.length);
		return index;
	}
	static range(min: number, max: number, startMode: "inclusive" | "exclusive" = "inclusive", endMode: "inclusive" | "exclusive" = "inclusive", step: number = 1) {
		[min, max] = [Math.min(min, max), Math.max(min, max)];
		step = Math.abs(step);

		if(step === 0) {
			throw new Error("Cannot create a range with a step of 0.");
		}

		const result = [];
		const startValue = (startMode === "inclusive") ? min : min + step;
		for(let value = startValue; (value < max && endMode === "exclusive") || (value <= max && endMode === "inclusive"); value += step) {
			result.push(value);
		}
		return result;
	}

	static toggleSetElement<T>(set: Set<T>, element: T) {
		if(set.has(element)) {
			set.delete(element);
		}
		else {
			set.add(element);
		}
	}

	private static remainingValidItems<T>(items: T[], index: number, allowRepetition: DuplicateMode, orderMode: OrderMode) {
		if(orderMode === "tuples") {
			if(allowRepetition === "all-distinct") {
				return items.filter(item => item !== items[index]);
			}
			else if(allowRepetition === "allow-duplicates") {
				return items.filter((item, i) => i !== index);
			}
			else {
				return items;
			}
		}
		else {
			if(allowRepetition === "all-distinct") {
				return items.slice(index + 1).filter(item => item !== items[index]);
			}
			else if(allowRepetition === "allow-duplicates") {
				return items.slice(index + 1);
			}
			else {
				return items.slice(index);
			}
		}
	}
	static combinations<T>(
		items: T[] | Set<T>,
		size: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static combinations<T>(
		items: T[] | Set<T>,
		minSize: number,
		maxSize: number,
		allowRepetition: DuplicateMode,
		orderMode: OrderMode
	): Generator<T[]>;
	static *combinations<T>(
		arg0: T[] | Set<T>,
		arg1: number,
		arg2: number | DuplicateMode,
		arg3: OrderMode | DuplicateMode,
		arg4?: OrderMode,
	): Generator<T[]> {
		if(typeof arg2 === "number") {
			const [items, minSize, maxSize, allowRepetition, orderMode] = [[...arg0], arg1, arg2, arg3, arg4] as [T[], number, number, DuplicateMode, OrderMode];
			for(let size = minSize; size <= maxSize; size ++) {
				yield* Utils.combinations(items, size, allowRepetition, orderMode);
			}
		}
		else {
			const [items, size, allowRepetition, orderMode] = [[...arg0], arg1, arg2, arg3] as [T[], number, DuplicateMode, OrderMode];
			if(size === 1) {
				const uniqueItems = [...new Set(items)];
				for(const item of uniqueItems) {
					yield [item];
				}
				return;
			}
			for(const [index, firstItem] of items.entries()) {
				if(items.slice(0, index).includes(firstItem)) {
					continue;
				}
				const remainingItems = Utils.remainingValidItems(items, index, allowRepetition, orderMode);
				for(const tupleOrSet of Utils.combinations(remainingItems, size - 1, allowRepetition, orderMode)) {
					yield [firstItem, ...tupleOrSet];
				}
			}
		}
	}
}
