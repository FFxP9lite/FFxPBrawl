import { PlayerDisplayData } from "../misc/PlayerDisplayData.js";
import { ByteStream } from "../misc/ByteStream.js";
import { config } from "../Definitions.js";

export class TeamMember {
  isOwner = true;
  state = 0;
  playerDisplayData: PlayerDisplayData;
  characterID = 0;
  ready = false;

  constructor(isOwner: boolean, state: number) {
    this.isOwner = isOwner;
    this.state = state;
    this.characterID = config.selectedBrawlers[0];
    this.playerDisplayData = new PlayerDisplayData(
      config.name,
      config.thumbnail,
      config.namecolor,
    );
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeBoolean(this.isOwner);
    stream.writeLong(0, 1); // acc id
    stream.writeDataReference(16, this.characterID);
    stream.writeDataReference(29, 0); // skin
    stream.writeVInt(1000);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(this.state);
    stream.writeBoolean(this.ready);
    stream.writeVInt(0); // team index
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream = this.playerDisplayData.encode(stream);
    for (let i = 0; i < 5; i++) {
      stream.writeVInt(0); // gears, starpower, gadget and hypercharge respectfully
    }
    stream.writeVInt(0);
    return stream;
  }
}
