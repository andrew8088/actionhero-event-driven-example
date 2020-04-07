import { EventChannel } from './event-channel';

let _id = 0;
const DB = [];

interface MemberRegisterPayload {
    username: string;
    password: string;
}

export default class MemberController {
    constructor(private stream: EventChannel) {
        stream.on('member:register', this.handleMemberRegister.bind(this));
    }

    handleMemberRegister(doneId: string, payload: MemberRegisterPayload) {
        const member = {
            id: ++_id,
            ...payload
        };

        DB.push(member);
        this.stream.emit(doneId, member);
    }
}

