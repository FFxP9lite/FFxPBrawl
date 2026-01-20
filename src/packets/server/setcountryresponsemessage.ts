import { config } from "../../Definitions.js";
import { ByteStream } from "../../misc/ByteStream.js";
import { Long } from "src/Long.js";

export class SetCountryResponseMessage {
  static encode(country: Long): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(0);
    stream.writeDataReference(country.high, country.low)

    return stream.payload;
  }
}
