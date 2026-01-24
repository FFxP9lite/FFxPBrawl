import { getMapCount, getMapList, readMapFile } from "src/mapmaker.js";
import { ByteStream } from "../../../misc/ByteStream.js";
import { PlayerMap } from "../../../misc/PlayerMap.js";
import { Logger } from "src/utility/Logger.js";
import { zlib } from "src/utility/zlib.js";

export class PlayerMapsMessage {
  static encode(): number[] {
    let stream = new ByteStream([]);

    const mapList = getMapList()
    Logger.verbose("Found", mapList.length, "maps")
    stream.writeVInt(mapList.length);

    for (let i = 0; i < mapList.length; i++) {
      let mapName = mapList[i]
      let mapMatch = mapName.match(/\d+-(\d+)\.txt/), mapIdLow
      if (mapMatch !== null && mapMatch.hasOwnProperty(1)) {
        mapIdLow = parseInt(mapMatch[1])
      } else {
        Logger.error("Failed to parse map", mapName)
        continue
      }

      // Get map byte array
      let mapObj = readMapFile(mapName)
      let mapByteArray = []
      let map;

      if (mapObj !== null) {
        if (mapObj.map !== "") {
          if (mapObj.gmv === 6 || mapObj.gmv === 9)
            mapByteArray.push(84, 14, 0, 0) // SD (solo & duo)
          else
            mapByteArray.push(222, 2, 0, 0)

          const compressed = zlib.compress(mapObj.map)
          for (let o = 0; o < compressed.length; o++) {
              mapByteArray.push(compressed[o] & 0xff);
          }
        }

        Logger.verbose(mapObj.map)
        map = new PlayerMap(mapObj.name, mapObj.gmv, mapObj.theme, [0, mapIdLow], mapByteArray);
      } else {
        Logger.error("Some weird crash case probably occured, falling back to default")
        map = new PlayerMap("Failed to load", 0, 0, [0, mapIdLow], [])
      }

      // map.avatarname ? 
      stream = map.encode(stream);
    }


    return stream.payload;
  }
}
