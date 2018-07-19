
/**
 * Result of API method "short/create"
 */
export interface ApiResultShortCreate {
    short: string;
    source: string;
}

/**
 * Result of API method "short/most-popular"
 */
export type ApiResultShortMostPopular = {
    link: string;
    views: number;
    preview: string;
}[]