
/**
 * Simple fast pre validator
 * @param url URL
 */
export function validateUrl(url: string) {
    if (url.length > 1024) {
        throw new Error("To long");
    }

    if (! /^http(s)?:\/\/.*[^\.]\.[^\.]/.test(url)) {
        throw new Error("Incorrect URL");
    }
}

export function validateName(name: string) {
    if (name.length < 3 || name.length > 32) {
        throw new Error("Invalid string length");
    }

    if (/[^a-zA-Z0-9_\-]/.test(name)) {
        throw new Error("Use only numbers, letters and chars '-', '_'");
    }
}
