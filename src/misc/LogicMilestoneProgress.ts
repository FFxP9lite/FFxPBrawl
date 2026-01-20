import { ByteStream } from "./ByteStream";

export class LogicMilestoneProgress {
  id = 0;
  current = 0;
  highest = 0;

  constructor(id: number, current: number, highest: number) {
    this.id = id;
    this.current = current;
    this.highest = highest;
  }

  encode(stream: ByteStream): ByteStream {
    stream.writeVInt(this.id)
    stream.writeVInt(this.current)
    stream.writeVInt(this.highest)
    return stream;
  }
}
