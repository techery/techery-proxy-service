import { config as load } from 'dotenv';
import { env } from './helpers';
load();

const config: Config = Object.freeze({
    debug: env('DEBUG', false),
    app: {
        port: env('HERMET_API_PORT', 5000),
        base_url: env('HERMET_API_BASE_URL', 'http://localhost:5000/'),
        session_header: env('HERMET_SESSION_HEADER', 'x-session-id')
    },
    log: {
        app: env('LOG_API_FILE_NAME', 'log/api.log'),
        proxy: env('LOG_PROXY_FILE_NAME', 'log/proxy.log'),
        level: env('LOG_LEVEL', 'warn')
    },
    proxy: {
        port: env('HERMET_PROXY_PORT', 5050),
        timeout: env('PROXY_DEFAULT_TIMEOUT', 10000)
    },
    elasticsearch: {
        index: env('ELASTIC_INDEX', 'hermet')
    }
});

class Config {
    public debug: boolean;

    public app: {
        port: number,
        base_url: string,
        session_header: string
    };

    public log: {
        app: string,
        proxy: string,
        level: string
    };

    public proxy: {
        timeout: number,
        port: number
    };

    public elasticsearch: {
        index: string
    };
}

export { config, Config };
export default config;
