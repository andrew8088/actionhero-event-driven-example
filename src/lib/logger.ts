import { api } from 'actionhero';

export class Logger {
    constructor(private baseMeta: any = {}) {}

    log(message: string, level: string, meta: any = {}) {
        api.log(message, level, { ...this.baseMeta, ...meta });
    }

    info(message: string, meta?: any) {
        this.log(message, 'info', meta);
    }

    warn(message: string, meta?: any) {
        this.log(message, 'warn', meta);
    }

    error(message: string, meta?: any) {
        this.log(message, 'error', meta);
    }
}