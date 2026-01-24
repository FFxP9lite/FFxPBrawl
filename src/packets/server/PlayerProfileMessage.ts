import { ByteStream } from "../../misc/ByteStream.js";
import { config } from "../../Definitions.js";
import { PlayerDisplayData } from "../../misc/PlayerDisplayData.js";
import { calculateHighestTrophies, calculateTrophies } from "../../util.js";

export class PlayerProfileMessage {
  static encode(): number[] {
    let stream = new ByteStream([]);

    // PlayerProfile::encode
    stream.writeVLong(config.id.high, config.id.low);
    stream.writeDataReference(16, config.favouriteBrawler);
    stream.writeDataReference(16, config.winstreakBrawler); // winstreak brawler

    // HeroEntry::encode
    stream.writeVInt(1); // hero entry

    stream.writeDataReference(16, 1); // character id
    stream.writeDataReference(0, -1); // skin equipped
    stream.writeVInt(0); // trophies
    stream.writeVInt(0); // highest trophies
    stream.writeVInt(1); // highest season trophies
    stream.writeVInt(0); // power level
    stream.writeVInt(0); // mastery

    stream.writeVInt(16);
    stream.writeVInt(1);
    stream.writeVInt(config.trioWins);
    stream.writeVInt(8);
    stream.writeVInt(config.soloWins);
    stream.writeVInt(11);
    stream.writeVInt(config.duoWins);
    stream.writeVInt(29);
    stream.writeVInt(calculateTrophies(config.ownedBrawlers));
    stream.writeVInt(4);
    stream.writeVInt(calculateHighestTrophies(config.ownedBrawlers));
    stream.writeVInt(24);
    stream.writeVInt(config.rankedHighest);
    stream.writeVInt(25);
    stream.writeVInt(config.rankedCurrent);
    stream.writeVInt(20);
    stream.writeVInt(config.fameCredits);
    stream.writeVInt(27);
    stream.writeVInt(config.creationDate);
    stream.writeVInt(28);
    stream.writeVInt(config.r35brawlers);
    stream.writeVInt(9);
    stream.writeVInt(config.highestRoboRumbleLvlPassed);
    stream.writeVInt(12);
    stream.writeVInt(config.highestBossFightLvlPassed);
    stream.writeVInt(15);
    stream.writeVInt(config.mostChallengeWins);
    stream.writeVInt(16);
    stream.writeVInt(config.highestRampageLvlPassed);
    stream.writeVInt(18);
    stream.writeVInt(config.highestSoloLeague);
    stream.writeVInt(19);
    stream.writeVInt(config.highestClubLeague);

    /* ***************************************** */
    let displaydata = new PlayerDisplayData(
      config.name,
      config.thumbnail,
      config.namecolor,
    );
    stream = displaydata.encode(stream);

    /* ***************************************** */
    stream.writeBoolean(false);
    stream.writeString("hello world");
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(config.winstreak); // max winstreak
    stream.writeDataReference(29, 0); // hero skin
    stream.writeDataReference(0, -1); // thumbnail 1
    stream.writeDataReference(0, -1); // thumbnail 2
    stream.writeDataReference(0, -1); // emote
    stream.writeDataReference(0, -1); // title

    stream.writeBoolean(false); // alliance header
    stream.writeDataReference(0, 0); // alliance role

    stream.writeVInt(0);

    return stream.payload;
  }
}
