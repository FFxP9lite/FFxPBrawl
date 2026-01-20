import { ByteStream } from "./ByteStream";
import { version } from "version";

export class PlayerDisplayData {
  name = "Natesworks";
  thumbnail = 0;
  namecolor = 0;

  constructor(name: string, thumbnail: number, namecolor: number) {
    this.name = name;
    this.thumbnail = thumbnail;
    this.namecolor = namecolor;
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeString(this.name);
    stream.writeVInt(100);
    stream.writeVInt(28000000 + this.thumbnail);
    stream.writeVInt(43000000 + this.namecolor);
    stream.writeVInt(43000000 + this.namecolor); // haspremiumpass == + config.namecolor
    if (version.gmv == 64) {
      stream.writeBoolean(false);
      stream.writeVInt(0);
      stream.writeVInt(0);
    }
    return stream;
  }
}
