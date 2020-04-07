import { task } from 'actionhero';
import { EventEmitter } from 'events';
import { Logger } from './logger';
import { v1 } from 'uuid';

export class EventId {
    id: string;

    constructor() {
        this.id = v1();
    }

    toString() {
        return this.id;
    }

    valueOf() {
        return this.id;
    }
}

const isCompletionEvent = (id) => id.indexOf(':completed:') > 0;

export interface EventChannel {
    emit(eventType: string, ...args: any[]): Promise<any>;
    on(eventType: string, listener: (...args: any[]) => void): void;
    once(eventType: string, listener: (...args: any[]) => void): void;
}

export class EmitterEventChannel implements EventChannel {
    private eventEmitter: EventEmitter;

    constructor(private logger: Logger) {
        this.eventEmitter = new EventEmitter();
    }

    emit(eventType: string, ...args: any[]): Promise<any> {
        const id = new EventId();

        this.logger.info('NEW EVENT', {
            eventType,
            id,
            args
        });

        const completeEventId = `${eventType}:completed:${id}`;

        return new Promise((resolve, reject) => {
            if (!isCompletionEvent(eventType)) {
                this.eventEmitter.once(completeEventId, (_, response) => resolve(response));
                setTimeout(() => reject('timeout'), 1000);
            }

            this.eventEmitter.emit(eventType, completeEventId, ...args);
        });
    }

    exec(eventType: string, ...args: any[]): void {
        this.eventEmitter.emit(eventType, ...args);
    }

    on(eventType: string | symbol, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(eventType, listener);
    }

    once(eventType: string | symbol, listener: (...args: any[]) => void): void {
        this.eventEmitter.once(eventType, listener);
    }
}

export class QueuedEventChannel implements EventChannel {
    private eventEmitter: EventEmitter;

    constructor(private logger: Logger) {
        this.eventEmitter = new EventEmitter();
    }

    async emit(eventType: string, ...args: any[]): Promise<any> {
        const id = new EventId();

        this.logger.info('NEW EVENT', {
            eventType,
            id,
            args
        });

        const completeEventId = `${eventType}:completed:${id}`;

        return new Promise(async (resolve, reject) => {
            if (!isCompletionEvent(eventType)) {
                this.eventEmitter.once(completeEventId, (_, response) => resolve(response));
                setTimeout(() => reject('timeout'), 5000);
            }

            await task.enqueue('execute-event', {
                eventType,
                completeEventId,
                id,
                args
            }, 'default');
        });
    }

    exec(eventType: string, ...args: any[]): void {
        this.eventEmitter.emit(eventType, ...args);
    }

    on(eventType: string | symbol, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(eventType, listener);
    }

    once(eventType: string | symbol, listener: (...args: any[]) => void): void {
        this.eventEmitter.once(eventType, listener);
    }
}

// export const stream = new QueuedEventChannel(new Logger());
export const stream = new EmitterEventChannel(new Logger());