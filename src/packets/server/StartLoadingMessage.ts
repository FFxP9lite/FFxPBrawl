import { ByteStream } from "src/misc/ByteStream";
import { PlayerDisplayData } from "src/misc/PlayerDisplayData";

export class StartLoadingMessage {
    static encode() {
        let stream = new ByteStream([])

        stream.writeInt(6)
        stream.writeInt(1)
        stream.writeInt(1)

        stream.writeInt(6) // Real player count
        for (let i = 0; i < 6; i++) { // while
            let isPlayer = !Boolean(i)

            stream.writeInt(0)
            stream.writeInt(1)

            stream.writeBoolean(true)

            stream = new PlayerDisplayData("Banaanae", 0, 0).encode(stream)

            stream.writeVInt(isPlayer ? 11 : 1)
            //stream.writeDataReference(0, 0)
            //stream.writeDataReference(0, 0)
            //stream.writeDataReference(0, 0)
            //stream.writeDataReference(0, 0)
            stream.writeVInt(0) // Star power
            stream.writeVInt(0) // Gadget?
            stream.writeVInt(0) // Gear 1
            stream.writeVInt(0) // Gear 2

            stream.writeVInt(0) // Hypercharge?
            stream.writeVInt(0)

            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeInt(0)
            stream.writeByte(0) // Falsed flag

            stream.writeBoolean(false)

            // a1+376
            if (false) {
                stream.writeBoolean(true)
                stream.writeLong(0, 1) // a1+376
                stream.writeString("idk")
                stream.writeDataReference(0, 1)
            } else {
                stream.writeBoolean(false)
            }

            stream.writeByte(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeVInt(0)
            stream.writeBoolean(false)
        }

        stream.writeInt(0)

        stream.writeInt(0)

        stream.writeInt(1) // game type
        stream.writeVInt(1) // map mode
        stream.writeVInt(0) // gmv
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeBoolean(false)
        stream.writeVInt(1) // spectate mode
        stream.writeVInt(0)
        stream.writeDataReference(16, 7) // location

        stream.writeBoolean(false) // Player map

        stream.writeBoolean(false)
        stream.writeBoolean(false)
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeBoolean(true) // Show quit
        stream.writeVInt(0)
        stream.writeVInt(0)
        stream.writeVInt(0)


        return stream.payload
    }
}