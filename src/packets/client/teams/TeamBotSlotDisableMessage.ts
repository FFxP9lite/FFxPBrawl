import { ByteStream } from "src/misc/ByteStream";
import { Long } from "src/Long";
import { Messaging } from "src/Messaging";
import { TeamEntry } from "src/teams/TeamEntry";
import { TeamMember } from "src/teams/TeamMember";

export class TeamBotSlotDisableMessage {
    static decode(stream: ByteStream) {
        let botIdx = stream.readInt()
        let status = stream.readBoolean()

        return [botIdx, status]
    }

    static execute(changedSlot: any[]) {
        let entry = new TeamEntry(new Long(0, 1), 1, -1, changedSlot);
        entry.teamMembers.push(new TeamMember(true, 3));
        let stream = new ByteStream([]);
        Messaging.sendOfflineMessage(24124, entry.encode(stream).payload);
    }
}