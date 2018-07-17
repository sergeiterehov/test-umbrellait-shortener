"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitshuffle_1 = require("./helpers/bitshuffle");
for (let i = 0; i < 30; i++) {
    console.log(bitshuffle_1.bitshuffle((2 ** 40) - i * 10).toString(36));
}
