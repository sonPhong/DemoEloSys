export class Stats {
    constructor(players, matches) {
        this.players = players;
        this.matches = matches;
    }

    processMatchResults() {
        this.matches.forEach(match => {
            match.teamA.forEach(player => this.updatePlayerStats(player, match, 'A', match.winner === 'A'));
            match.teamB.forEach(player => this.updatePlayerStats(player, match, 'B', match.winner === 'B'));
        });
    }

    updatePlayerStats(player, match, team, win) {
        player.detail.matches.push({
            matchId: match.id,
            team,
            win,
        });

        if (win) {
            player.detail.winCount++;
            player.detail.winStreak++;
            player.detail.loseStreak = 0;
            player.detail.maxWinStreak = Math.max(player.detail.maxWinStreak, player.detail.winStreak);
        } else {
            player.detail.loseCount++;
            player.detail.loseStreak++;
            player.detail.winStreak = 0;
            player.detail.maxLoseStreak = Math.max(player.detail.maxLoseStreak, player.detail.loseStreak);
        }
    }
}