var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * Generate shuffled vector
 * @param size Number of bits for shuffled vector
 */
function generateArrangementVector(size) {
    var vector = __spread(Array(size).keys());
    var stack = __spread(Array(size).keys());
    for (var i = 0; i < size; i++) {
        vector[i] = stack.splice(Math.trunc(Math.random() * stack.length), 1)[0];
    }
    return vector;
}
/**
 * Generate JS part
 * @param vector Shuffled vector
 */
function generateShuffleJs(vector) {
    var sum = vector.map(function (a, b) { return "(((n >> " + a + ") & 0b1) << " + b + ")"; }).join(" +\n");
    return "const bithash = (n) => (\n" + sum + "\n);";
}
if (!process.argv[2]) {
    throw new Error("Using: node {this-file.js} {size in bits}");
}
var bitsAmount = parseInt(process.argv[2], 10);
if (0 === bitsAmount) {
    throw new Error("Use non zero numbers");
}
var js = generateShuffleJs(generateArrangementVector(bitsAmount));
process.stdout.write(js + "\n");
