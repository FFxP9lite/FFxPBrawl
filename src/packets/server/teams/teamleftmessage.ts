import { ByteStream } from "src/bytestream";

export class TeamLeftMessage {
    static encode(): number[] {
        let stream = new ByteStream([])

        stream.writeInt(0)

        return stream.payload
    }
}