function generateArrangementVector(size) {
    const vector = [...Array(size).keys()];
    const stack = [...Array(size).keys()];

    for (let i = 0; i < size; i++) {
        vector[(Math.trunc(Math.random() * size) << 4) % stack.pop()] = i;
    }

    return vector;
}

console.log(generateArrangementVector(8));
