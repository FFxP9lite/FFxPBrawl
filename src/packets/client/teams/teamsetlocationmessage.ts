import { ByteStream } from "src/bytestream";
import { Long } from "src/long";
import { Messaging } from "src/messaging";
import { TeamEntry } from "src/teams/teamentry";
import { TeamMember } from "src/teams/teammember";

export class TeamSetLocationMessage {
    static decode(stream: ByteStream) {
        let mapID = stream.readDataReference()
        stream.readInt() // Unknown

        return mapID.low
    }

    static execute(locationID: number) {
        let entry = new TeamEntry(new Long(0, 1), 1, locationID);
        entry.teamMembers.push(new TeamMember(true, 3));
        let stream = new ByteStream([]);
        Messaging.sendOfflineMessage(24124, entry.encode(stream).payload);
    }
}