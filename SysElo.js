export class SysElo {
  updateElo(match) {
    const teamAWin = match.winner === 'A';
    const winners = teamAWin ? match.teamA : match.teamB;
    const losers = teamAWin ? match.teamB : match.teamA;

    winners.forEach(player => {
      const streakBonus = player.detail.winStreak >= 3 ? 1.1 : 1.0;
      player.eloScore += Math.round(30 * streakBonus);
    });

    losers.forEach(player => {
      const streakPenalty = player.detail.loseStreak >= 3 ? 1.1 : 1.0;
      player.eloScore -= Math.round(30 * streakPenalty);
    });
  }

  processAll(matches) {
    matches.forEach(match => this.updateElo(match));
  }
}