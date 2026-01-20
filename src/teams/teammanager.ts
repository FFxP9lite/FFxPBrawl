import { ByteStream } from "../misc/ByteStream";
import { Long } from "../Long";
import { Messaging } from "../Messaging";
import { TeamEntry } from "./TeamEntry";
import { TeamMember } from "./TeamMember";

export class TeamManager {
  static createTeam() {
    let entry = new TeamEntry(new Long(0, 1), 1, 5);
    entry.teamMembers.push(new TeamMember(true, 3));
    let stream = new ByteStream([]);
    Messaging.sendOfflineMessage(24124, entry.encode(stream).payload);
  }
}
