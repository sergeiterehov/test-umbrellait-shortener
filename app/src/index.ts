import { bitshuffle } from "./helpers/bitshuffle";

for (let i = 0; i < 30; i++) {
    console.log(bitshuffle((2 ** 40) - i * 10).toString(36));
}
