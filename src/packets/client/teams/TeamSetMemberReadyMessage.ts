import { ByteStream } from "src/misc/ByteStream";
import { Messaging } from "src/Messaging";
import { TeamGameStartingMessage } from "src/packets/server/teams/TeamGameStartingMessage";

export class TeamSetMemberReadyMessage {
    static decode(stream: ByteStream) {
        let isReady = stream.readBoolean()
        let player = stream.readVInt()

        return isReady
    }

    static execute(isReady: boolean) {
        let stream = new ByteStream([])
        Messaging.sendOfflineMessage(24130, TeamGameStartingMessage.encode(stream))

        return stream.payload
    }
}
