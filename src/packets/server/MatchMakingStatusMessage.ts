import { ByteStream } from "src/misc/ByteStream";

export class MatchMakingStatusMessage {
    static encode() {
        let stream = new ByteStream([])

        stream.writeInt(1) // Player count
        stream.writeInt(6) // Max players
        stream.writeInt(0)
        stream.writeInt(0)
        stream.writeInt(0)
        stream.writeBoolean(false) // Show tips

        return stream.payload
    }
}