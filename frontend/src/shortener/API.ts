import { ApiResultShortMostPopular } from "./types/api.d";
import { ErrorData } from "./errors/ErrorData";
import { ApiResultShortCreate } from "./types/api";

export interface IRequestObject {
    [key: string]: string|boolean|number|void;
}

/**
 * Project API
 */
export class API {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Create new short link
     * @param url Long source url
     * @param name Personal name (optional)
     */
    public async shortCreate(url: string, name?: string): Promise<ApiResultShortCreate> {
        const data = name ? {url, name} : {url};
        const response = await this.request("short/create", undefined, data);

        switch (response.status) {
            case 400: throw new ErrorData((await response.json()).errors);
            case 500: throw new Error("Server error: " + await response.text());
            case 200: return await response.json();
        }

        throw new Error("Unknown error");
    }

    /**
     * Returns top most popular links
     */
    public async shortMostPopular(): Promise<ApiResultShortMostPopular> {
        const response = await this.request("short/most-popular");

        if (200 !== response.status) {
            throw new Error("Most popular links can't be received");
        }

        return await response.json();
    }

    /**
     * Request layout
     * @param method Method name after base url
     * @param query Query object
     * @param data Data body object
     */
    private async request(method: string, query?: IRequestObject, data?: IRequestObject): Promise<Response> {
        let params = "";

        if (query) {
            params = "?" + Object.keys(query)
            .map((key) => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(`${query[key]}`)}`;
            }).join("&");
        }

        const url = `${this.baseUrl}${method}${params}`;

        const options: RequestInit = {
            method: data ? "post" : "get",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: data ? JSON.stringify(data) : undefined,
        };

        return await fetch(url, options);
    }
}

/**
 * Main API object
 */
export const api = new API("/api/v1/");
