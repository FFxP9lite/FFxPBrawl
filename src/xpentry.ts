import { ByteStream } from "./bytestream";

export class XpEntry {
  current = 0;
  highest = 0;

  constructor(current: number, highest: number) {
    this.current = current;
    this.highest = highest;
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeVInt(this.current)
    stream.writeVInt(this.highest)
    return stream;
  }
}
