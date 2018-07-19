
/**
 * Simple fast pre validator
 * @param url URL
 */
export function validateUrl(url) {
    if (! /^http(s)?:\/\/.*[^\.]\.[^\.]/.test(url)) {
        throw new Error("Incorrect URL");
    }
}
