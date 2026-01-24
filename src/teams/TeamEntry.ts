import { TeamMember } from "./TeamMember.js";
import { Long } from "../Long.js";
import { ByteStream } from "../misc/ByteStream.js";
import { zlib } from "src/utility/zlib.js";
import { readMapFile } from "src/mapmaker.js";
import { stringToUtf8Array, utf8ArrayToString } from "src/util.js";
import { Logger } from "src/utility/Logger.js";

type Team = {
  locationID: number;
  disabledBots: any[];
}

let team: Team = {
  locationID: 0,
  disabledBots: []
}

export class TeamEntry {
  id: Long;
  type = 0;
  locationID: number = 0;
  teamMembers: TeamMember[] = [];

  constructor(id: Long, type: number, locationID: number, changedSlot: any[], init = false) {
    this.id = id;
    this.type = type;
    if (locationID !== -1) {
      team.locationID = locationID
      this.locationID = locationID;
    } else {
      this.locationID = team.locationID
    }

    if (init) {
      team.disabledBots = []
    } else if (changedSlot.length === 2) {
      let found = false
      for (let i = 0; i < team.disabledBots.length; i++) {
        if (changedSlot[0] === team.disabledBots[i]) {
          found = true
          if (!changedSlot[1])
            team.disabledBots.splice(i, 1)
          break
        }
      }
      if (!found && changedSlot[1])
        team.disabledBots.push(changedSlot[0])
    }
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeVInt(this.type);
    stream.writeBoolean(this.type == 1);
    stream.writeVInt(3);
    stream.writeLong(this.id.high, this.id.low);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    if (this.locationID < 1000000)
      stream.writeDataReference(15, this.locationID);
    else
      stream.writeDataReference(0, this.locationID - 1000000)


    let battlePlayerMap = this.locationID >= 1000000
    stream.writeBoolean(battlePlayerMap); // battle player map
    if (battlePlayerMap) {
      stream.writeLong(0, 1)
      stream.writeString("test")
      stream.writeVInt(0)
      stream.writeDataReference(0, 1)
      stream.writeDataReference(0, 1)
      stream.writeBytes([0x00], 1)
      stream.writeLong(0, 1)

      let map = readMapFile("0-1.txt")
      if (map !== null)
        stream.writeString(utf8ArrayToString(zlib.compress(map.map)))
      stream.writeVInt(0)
      
      stream.writeVInt(1)
      stream.writeLong(0, 1)
    }

    stream.writeVInt(this.teamMembers.length);
    stream = this.teamMembers.reduce((prev, x) => {
      return x.encode(prev);
    }, stream);
    stream.writeVInt(0); // invites
    stream.writeVInt(0); // join requests
    stream.writeVInt(team.disabledBots.length); // disabled bots
    for (let i = 0; i < team.disabledBots.length; i++) {
      stream.writeVInt(team.disabledBots[i])
    }
    stream.writeBoolean(true); // enable chat
    stream.writeBoolean(false); // accessory
    stream.writeBoolean(false); // gears
    stream.writeVInt(0); // mods
    return stream;
  }
}
