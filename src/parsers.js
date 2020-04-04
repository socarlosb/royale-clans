const { format, parseISO } = require("date-fns");
const { DATEFORMAT } = require("./configs");

exports.parsePlayerData = (data, clan, warLog) => {
  // check if player is in a clan
  if (clan) {
    const playerClanData = parseMembers([data], warLog, clan.memberList);
    const parsedPlayerData = playerClanData["members"]
      .filter((element) => element !== undefined)
      .shift();

    return {
      inClanName: clan.name,
      inClanTag: clan.tag,
      ...parsedPlayerData,
    };
  }

  return {
    tag: data.tag,
    name: data.name,
    expLevel: data.expLevel,
    trophies: data.trophies,
    bestTrophies: data.bestTrophies,
    wins: data.wins,
    losses: data.losses,
    warDayWins: data.warDayWins,
    challengeCardsWon: player.challengeCardsWon,
    challengeMaxWins: player.challengeMaxWins,
    tournamentCardsWon: player.tournamentCardsWon,
    tournamentBattleCount: player.tournamentBattleCount,
    currentFavouriteCard: player.currentFavouriteCard.name,
    winRate: Number(((data.wins / (data.wins + data.losses)) * 100).toFixed(0)),
    cards13: Number(
      (calcCardPercentage(data.cards, 13, data.cards.length) * 100).toFixed(0)
    ),
    cards12: Number(
      (calcCardPercentage(data.cards, 12, data.cards.length) * 100).toFixed(0)
    ),
    cards11: Number(
      (calcCardPercentage(data.cards, 11, data.cards.length) * 100).toFixed(0)
    ),
    cards10: Number(
      (calcCardPercentage(data.cards, 10, data.cards.length) * 100).toFixed(0)
    ),
    cards9: Number(
      (calcCardPercentage(data.cards, 9, data.cards.length) * 100).toFixed(0)
    ),
  };
};

exports.parseClanData = (data, wars, allMembers) => {
  const warLogs = parseWarData(data.tag, wars);
  const membersInfo = parseMembers(allMembers, wars, data.memberList);

  return {
    updatedAt: format(Date.now(), DATEFORMAT),
    tag: data.tag,
    name: data.name,
    description: data.description,
    type: data.type,
    members: data.members,
    clanScore: data.clanScore,
    clanWarTrophies: data.clanWarTrophies,
    requiredTrophies: data.requiredTrophies,
    warLogs,
    warLogsLength: warLogs.length,
    avgWarWinRate: Number(membersInfo.avg.warWinRate),
    avgWinRate: Number(membersInfo.avg.winRate),
    avgDonations: Number(membersInfo.avg.donations),
    avgCardsEarned: Number(membersInfo.avg.cardsEarned),
    memberList: membersInfo.members,
  };
};

const parseWarData = (tag, arr) => {
  if (arr.length === 0) return [];
  return arr.map((item) => {
    const { standings } = item;
    const stands = standings
      .filter((element) => {
        return element.clan.tag === tag;
      })
      .shift();

    return {
      seasonId: item.seasonId,
      createdDate: format(parseISO(item.createdDate), DATEFORMAT),
      trophyChange: stands.trophyChange,
      participants: stands.clan.participants,
      battlesPlayed: stands.clan.battlesPlayed,
      wins: stands.clan.wins,
      crowns: stands.clan.crowns,
    };
  });
};

const parseMembers = (players, warsLogs, memberList) => {
  let warWinRate = 0;
  let winRate = 0;
  let donations = 0;
  let activeMembers = 0;
  let cardsEarned = 0;

  const members = memberList.map((item) => {
    const player = players
      .filter((element) => {
        return element.tag === item.tag;
      })
      .shift();

    if (!player) return;

    const playerWars = {
      numberOfWars: 0,
      cardsEarned: 0,
      battlesPlayed: 0,
      wins: 0,
      collectionDayBattlesPlayed: 0,
      numberOfBattles: 0,
      winStreak: 0,
    };

    if (warsLogs.length !== 0) {
      warsLogs.reverse();
      warsLogs.forEach((war) => {
        const { participants } = war;
        const warMember = participants
          .filter((element) => {
            return element.tag === player.tag;
          })
          .shift();

        if (!warMember) return;

        playerWars.battlesPlayed += warMember.battlesPlayed;
        playerWars.wins += warMember.wins;
        playerWars.numberOfBattles += warMember.numberOfBattles;
        playerWars.cardsEarned += warMember.cardsEarned;
        playerWars.collectionDayBattlesPlayed +=
          warMember.collectionDayBattlesPlayed;
        playerWars.numberOfWars += 1;
        warMember.wins != 0
          ? (playerWars.winStreak += warMember.wins)
          : (playerWars.winStreak = 0);
      });
    }

    if (playerWars.numberOfBattles !== 0) {
      warWinRate += Number(
        ((playerWars.wins / playerWars.numberOfBattles) * 100).toFixed(0)
      );
      activeMembers += 1;
      cardsEarned += playerWars.cardsEarned;
    }

    winRate += Number(
      ((player.wins / (player.wins + player.losses)) * 100).toFixed(0)
    );

    if (player.donations !== 0) donations += item.donations;

    return {
      tag: item.tag,
      name: item.name,
      role: item.role,
      lastSeen: format(parseISO(item.lastSeen), DATEFORMAT),
      expLevel: item.expLevel,
      trophies: item.trophies,
      clanRank: item.clanRank,
      previousClanRank: item.previousClanRank,
      donations: item.donations,
      // from player info
      bestTrophies: player.bestTrophies,
      wins: player.wins,
      losses: player.losses,
      challengeCardsWon: player.challengeCardsWon,
      challengeMaxWins: player.challengeMaxWins,
      tournamentCardsWon: player.tournamentCardsWon,
      tournamentBattleCount: player.tournamentBattleCount,
      currentFavouriteCard: player.currentFavouriteCard.name,
      warDayWins: player.warDayWins,
      winRate: Number(
        ((player.wins / (player.wins + player.losses)) * 100).toFixed(0)
      ),
      cards13: Number(
        (
          calcCardPercentage(player.cards, 13, player.cards.length) * 100
        ).toFixed(0)
      ),
      cards12: Number(
        (
          calcCardPercentage(player.cards, 12, player.cards.length) * 100
        ).toFixed(0)
      ),
      cards11: Number(
        (
          calcCardPercentage(player.cards, 11, player.cards.length) * 100
        ).toFixed(0)
      ),
      cards10: Number(
        (
          calcCardPercentage(player.cards, 10, player.cards.length) * 100
        ).toFixed(0)
      ),
      cards9: Number(
        (
          calcCardPercentage(player.cards, 9, player.cards.length) * 100
        ).toFixed(0)
      ),
      // from wars
      warsCardsEarned: playerWars.cardsEarned,
      warsBattlesPlayed: playerWars.battlesPlayed,
      warsWins: playerWars.wins,
      warsCollectionDayBattlesPlayed: playerWars.collectionDayBattlesPlayed,
      warsNumberOfBattles: playerWars.numberOfBattles,
      warsWinStreak: playerWars.winStreak,
      warsNumberOfWars: playerWars.numberOfWars,
    };
  });

  return {
    members,
    avg: {
      warWinRate: (warWinRate / activeMembers || 0).toFixed(0),
      winRate: (winRate / memberList.length || 0).toFixed(0),
      cardsEarned: (cardsEarned / activeMembers || 0).toFixed(0),
      donations: (donations / activeMembers || 0).toFixed(0),
    },
  };
};

const calcCardPercentage = (cards, level, maxCards) => {
  const totalCards = cards.reduce((acc, current) => {
    let extra = 0;
    if (current.maxLevel === 5) extra = 8;
    else if (current.maxLevel === 8) extra = 5;
    else if (current.maxLevel === 11) extra = 2;
    else if (current.maxLevel === 13) extra = 0;

    if (current.level + extra >= level) acc++;
    return acc;
  }, 0);
  return (totalCards / maxCards).toFixed(2);
};
