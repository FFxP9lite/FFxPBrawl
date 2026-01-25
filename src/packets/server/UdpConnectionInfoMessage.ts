import { ByteStream } from "src/misc/ByteStream";

export class UdpConnectionInfoMessage {
    static encode() {
        let stream = new ByteStream([])

        stream.writeVInt(9339)
        stream.writeString("127.0.0.1")
        stream.writeBytes([0x00], 1)
        stream.writeBytes([0x00], 1)

        return stream.payload
    }
}