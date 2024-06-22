export class Utils {
	static randomItem<T>(items: Array<T>) {
		const index = Math.floor(Math.random() * items.length);
		return items[index];
	}
	static randomIndex<T>(items: Array<T>) {
		const index = Math.floor(Math.random() * items.length);
		return index;
	}

	static toggleSetElement<T>(set: Set<T>, element: T) {
		if(set.has(element)) {
			set.delete(element);
		}
		else {
			set.add(element);
		}
	}
}
