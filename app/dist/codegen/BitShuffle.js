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
    let body;
    if (32 >= vector.length) {
        // 32 bits
        const sum = vector.map((a, b) => `(((n >> ${a}) & 0b1) << ${b})`).join(" +\n");
        body = `(/* Up to 32 bits */\n${sum}\n)`;
    }
    else {
        // 64 bits
        const rh = [];
        const rl = [];
        vector.forEach((a, b) => {
            const expr = `(((${32 > a ? "nl" : "nh"} >>> ${a % 32}) & 0b1) << ${b % 32})`;
            if (32 > b) {
                rl.push(expr);
            }
            else {
                rh.push(expr);
            }
        });
        body = `{ /* More than 32 bits */\n` +
            `const nh = Math.trunc(n / (2 ** 32));\n` +
            `const nl = n % (2 ** 32);\n` +
            `const rh = (${rh.join(" +\n")});\n` +
            `const rl = (${rl.join(" +\n")});\n` +
            `return (rh * (2 ** 32) + rl);\n` +
            `}`;
    }
    return `export const bitshuffle = (n: number): number => ${body};`;
}
if (!process.argv[2]) {
    throw new Error("Using: node {this-file.js} {size in bits}");
}
const bitsAmount = parseInt(process.argv[2], 10);
if (0 === bitsAmount) {
    throw new Error("Use non zero numbers");
}
if (53 < bitsAmount) {
    throw new Error(`Integer numbers more than 2^53 is not precisely!\n`);
}
const js = generateShuffleJs(generateArrangementVector(bitsAmount));
process.stdout.write(`/* Autogenerated code for ${bitsAmount} bits */\n\n${js}\n`);
