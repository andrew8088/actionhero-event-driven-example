import { Action, ActionProcessor } from "actionhero";
import { stream } from '../lib/event-channel';

export class MemberPost extends Action {
    constructor() {
        super();
        this.name = "member-post";
        this.description = "member-post";
        this.inputs = {
            username: {
                required: true
            },
            password: {
                required: true
            }
        };
    }

    async run(data: ActionProcessor): Promise<void> {
        const { params: { username, password } } = data;
        const res = await stream.emit('member:register', { username, password });
        data.response.value = res;
        return;
    }
}