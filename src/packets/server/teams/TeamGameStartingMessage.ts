import { ByteStream } from "src/misc/ByteStream";

export class TeamGameStartingMessage {
    static encode(stream: ByteStream): number[] {
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeVInt(1)

        return stream.payload
    }
}