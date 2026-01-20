import { ByteStream } from "src/misc/ByteStream";
import { Long } from "src/Long";
import { Messaging } from "src/Messaging";
import { TeamEntry } from "src/teams/TeamEntry";
import { TeamMember } from "src/teams/TeamMember";

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