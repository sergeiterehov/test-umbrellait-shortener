const env = process.env;

export interface IConfig {
    app: {
        port: number,
    };
    redis: {
        host: string,
        port: number,
    };
}

export const config: IConfig = {
    app: {
        port: parseInt(env.APP_PORT, 10) || 3000,
    },
    redis: {
        host: env.REDIS_HOST || "localhost",
        port: parseInt(env.REDIS_PORT, 10) || 63790,
    },
};
