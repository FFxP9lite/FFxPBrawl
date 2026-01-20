import { TeamMember } from "./teammember.js";
import { Long } from "../long.js";
import { ByteStream } from "../bytestream.js";

export class TeamEntry {
  id: Long;
  type = 0;
  locationID = 0;
  teamMembers: TeamMember[] = [];
  constructor(id: Long, type: number, locationID: number) {
    this.id = id;
    this.type = type;
    this.locationID = locationID;
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeVInt(this.type);
    stream.writeBoolean(this.type == 1);
    stream.writeVInt(3);
    stream.writeLong(this.id.high, this.id.low);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    for (let i = 0; i < 3; i++) {
      stream.writeVInt(0);
    }
    stream.writeDataReference(15, this.locationID);
    stream.writeBoolean(false); // battle player map
    stream.writeVInt(this.teamMembers.length);
    stream = this.teamMembers.reduce((prev, x) => {
      return x.encode(prev);
    }, stream);
    stream.writeVInt(0); // invites
    stream.writeVInt(0); // join requests
    stream.writeVInt(0); // disabled bots
    stream.writeBoolean(true); // enable chat
    stream.writeBoolean(false); // accessory
    stream.writeBoolean(false); // gears
    stream.writeBoolean(false); // mods
    return stream;
  }
}
