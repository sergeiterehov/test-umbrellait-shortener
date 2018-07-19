
/**
 * Creates full url for the short link
 * @param short Id of short Link
 */
export const buildShortUrl = (short: string) => `${window.location.origin}/${short}`;
