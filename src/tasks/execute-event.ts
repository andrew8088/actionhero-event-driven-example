import { Task } from 'actionhero';
import { stream } from '../lib/event-channel';

export default class ExecuteEventTask extends Task {
    constructor() {
        super();
        this.name = 'execute-event';
        this.description = 'execute-event';
    }

    run(data): Promise<any> {
        try {
            const { eventType, args, completeEventId } = data;
            stream.exec(eventType, completeEventId, ...args);
            return null;
        } catch (err) {
            console.error(err);
        }
    }
}