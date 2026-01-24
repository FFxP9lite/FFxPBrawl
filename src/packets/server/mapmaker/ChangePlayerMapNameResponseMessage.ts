import { ByteStream } from "src/misc/ByteStream";
import { Long } from "src/Long";

export class ChangePlayerMapNameResponseMessage {
    static encode(id: Long): number[] {
        let stream = new ByteStream([]);
    
        stream.writeVInt(0); // err
        stream.writeVLong(id.high, id.low);
    
        return stream.payload;
    }
}