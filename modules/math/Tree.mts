export class Tree {
	static *leaves<T>(root: T, getChildren: (node: T) => T[] | Generator<T>) {
		const childrenGenerator = function*(node: T) { yield* getChildren(node); };

		type StackItem = { value: T, generator: Generator<T>, hasChildren: boolean };
		const stack: StackItem[] = [{ value: root, generator: childrenGenerator(root), hasChildren: false }];
		while(stack.length !== 0) {
			const currentItem = stack[stack.length - 1];
			const nextChild = currentItem.generator.next();
			if(nextChild.done) {
				stack.pop();
				if(!currentItem.hasChildren) {
					yield currentItem.value;
				}
			}
			else {
				currentItem.hasChildren = true;
				stack.push({ value: nextChild.value, generator: childrenGenerator(nextChild.value), hasChildren: false });
			}
		}
	}
	static *nodesAndAncestors<T>(root: T, getChildren: (node: T) => T[] | Generator<T>) {
		const childrenGenerator = function*(node: T) { yield* getChildren(node); };

		type StackItem = { value: T, generator: Generator<T>, ancestors: T[], yielded: boolean };
		const stack: StackItem[] = [{ value: root, generator: childrenGenerator(root), ancestors: [root], yielded: false }];
		while(stack.length !== 0) {
			const currentItem = stack[stack.length - 1];
			if(!currentItem.yielded) {
				currentItem.yielded = true;
				yield { node: currentItem.value, ancestors: currentItem.ancestors };
			}
			const nextChild = currentItem.generator.next();
			if(nextChild.done) {
				stack.pop();
			}
			else {
				stack.push({
					value: nextChild.value,
					generator: childrenGenerator(nextChild.value),
					ancestors: [...currentItem.ancestors, nextChild.value],
					yielded: false,
				});
			}
		}
	}
	static *nodes<T>(root: T, getChildren: (node: T) => T[] | Generator<T>) {
		for(const { node } of Tree.nodesAndAncestors(root, getChildren)) {
			yield node;
		}
	}
}
