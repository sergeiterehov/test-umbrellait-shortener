/**
 * Generate shuffled vector
 * @param size Number of bits for shuffled vector
 */
function generateArrangementVector(size) {
    const vector = [...Array(size).keys()];
    const stack = [...Array(size).keys()];
    for (let i = 0; i < size; i++) {
        vector[i] = stack.splice(Math.trunc(Math.random() * stack.length), 1)[0];
    }
    return vector;
}
/**
 * Generate JS part
 * @param vector Shuffled vector
 */
function generateShuffleJs(vector) {
    const sum = vector.map((a, b) => `(((n >> ${a}) & 0b1) << ${b})`).join(" +\n");
    return `const bithash = (n) => (\n${sum}\n);`;
}
if (!process.argv[2]) {
    throw new Error("Using: node {this-file.js} {size in bits}");
}
const bitsAmount = parseInt(process.argv[2], 10);
if (0 === bitsAmount) {
    throw new Error("Use non zero numbers");
}
const js = generateShuffleJs(generateArrangementVector(bitsAmount));
process.stdout.write(`${js}\n`);
