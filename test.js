class Stats {
    constructor(players) {
        this.players = players;
    }

    updateFromMatch(match) {
        match.getAllPlayers().forEach(player => {
            const isWin = match.didPlayerWin(player);
            const team = match.getPlayerTeam(player);
            const opponentTeam = team === 'A' ? match.teamB : match.teamA;
            player.updateStats(match.id, isWin, team, opponentTeam);
        });
    }
}

class SysElo {
    constructor(K = 32) {
        this.K = K;
    }

    calculateTeamAverage(team) {
        const totalElo = team.reduce((sum, player) => sum + player.elo, 0);
        return totalElo / team.length;
    }

    updateTeamElo(team, expectedScore, actualScore) {
        for (const player of team) {
            const streakBonus = player.detail.winStreak >= 5 ? 1.1 :
                player.detail.loseStreak >= 5 ? 0.9 : 1;

            const change = this.K * (actualScore - expectedScore) * streakBonus;

            player.elo = Math.max(0, player.elo + Math.round(change));
        }
    }

    applyMatchElo(match) {
        const teamA = match.teamA;
        const teamB = match.teamB;
        const teamAWins = match.winner === 'A';

        const avgA = this.calculateTeamAverage(teamA);
        const avgB = this.calculateTeamAverage(teamB);

        const expectedA = 1 / (1 + 10 ** ((avgB - avgA) / 400));
        const expectedB = 1 - expectedA;

        const actualA = teamAWins ? 1 : 0;
        const actualB = 1 - actualA;

        this.updateTeamElo(teamA, expectedA, actualA);
        this.updateTeamElo(teamB, expectedB, actualB);
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.name = `Player ${id}`;
        this.status = Math.round(Math.random());
        this.elo = this.status === 0 ? 1200 : Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        this.detail = {
            matches: [],
            opponents: new Set(),
            matchResults: [],
            eloHistory: [this.elo],
            winCount: 0,
            loseCount: 0,
            totalMatches: 0,
            winRate: 0.0,
            winStreak: 0,
            loseStreak: 0,
            maxWinStreak: 0,
            maxLoseStreak: 0,
        };
    }

    updateStats(matchId, isWin, team, opponentTeam) {
        const result = isWin ? 'Win' : 'Lose';

        this.detail.totalMatches++;
        opponentTeam.forEach(p => this.detail.opponents.add(p.name));

        this.detail.matches.push({
            matchId,
            result,
            team,
            opponent: opponentTeam.map(p => p.name),
            currentElo: this.elo
        });

        this.detail.matchResults.push({
            matchId,
            result,
            elo: this.elo
        });

        this.detail.eloHistory.push(this.elo);

        if (isWin) {
            this.detail.winCount++;
            this.detail.winStreak++;
            this.detail.loseStreak = 0;
            if (this.detail.winStreak > this.detail.maxWinStreak) {
                this.detail.maxWinStreak = this.detail.winStreak;
            }
        } else {
            this.detail.loseCount++;
            this.detail.loseStreak++;
            this.detail.winStreak = 0;
            if (this.detail.loseStreak > this.detail.maxLoseStreak) {
                this.detail.maxLoseStreak = this.detail.loseStreak;
            }
        }

        this.detail.winRate = (this.detail.winCount / this.detail.totalMatches * 100).toFixed(1);
    }
}

const nPlayer = 100;
const listPlayer = [];

function createPlayer(nPlayer) {
    for (let i = 1; i <= nPlayer; i++) {
        listPlayer.push(new Player(i));
    }
}

createPlayer(nPlayer);

class Match {
    constructor(id, teamA, teamB) {
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.winner = Math.random() < 0.5 ? 'A' : 'B';
    }

    getAllPlayers() {
        return [...this.teamA, ...this.teamB];
    }

    didPlayerWin(player) {
        return (this.winner === 'A' && this.teamA.includes(player)) ||
            (this.winner === 'B' && this.teamB.includes(player));
    }

    getPlayerTeam(player) {
        return this.teamA.includes(player) ? 'A' : 'B';
    }
}

const nMatch = 100;
const listMatch = [];

const stats = new Stats(listPlayer);
const sysElo = new SysElo();

function createMatch(nMatch) {
    const playerPool = [...listPlayer];
    let idMatch = 1;

    while (idMatch <= nMatch) {
        const roundPlayers = [...playerPool];

        for (let i = 0; i < nMatch / 10; i++) {
            const teamA = roundPlayers.splice(0, 5);
            const teamB = roundPlayers.splice(0, 5);
            const match = new Match(idMatch++, teamA, teamB);
            listMatch.push(match);

            stats.updateFromMatch(match);
            sysElo.applyMatchElo(match);
        }
    }
}

createMatch(nMatch);

function showLeaderboard() {
    const leaderboard = [...listPlayer]
        .sort((a, b) => b.elo - a.elo)
        .slice(0, 10);

    console.log(`\n🏆 Leaderboard (Top 10 Players by Elo):`);
    console.log(`| #  | Name        | Elo   | W/L  | Win% | Max WinStreak | Max LoseStreak |`);
    console.log(`|----|-------------|-------|------|------|----------------|-----------------|`);

    leaderboard.forEach((p, index) => {
        const totalMatches = p.detail.winCount + p.detail.loseCount;
        const winRate = totalMatches > 0 ? ((p.detail.winCount / totalMatches) * 100).toFixed(1) : "0.0";

        console.log(`| ${String(index + 1).padEnd(2)} | ${p.name.padEnd(11)} | ${String(p.elo).padEnd(5)} | ${p.detail.winCount}/${p.detail.loseCount} | ${winRate}% | ${p.detail.maxWinStreak.toString().padEnd(14)} | ${p.detail.maxLoseStreak.toString().padEnd(15)} |`);
    });
}

function showPlayerHistory(playerId) {
    const player = listPlayer.find(p => p.id === playerId);
    if (!player) {
        console.log(`Player ${playerId} not found`);
        return;
    }

    console.log(`\n📜 Match History for ${player.name} (Elo: ${player.elo})`);
    console.log(`Wins: ${player.detail.winCount}, Losses: ${player.detail.loseCount}`);
    console.log(`Max WinStreak: ${player.detail.maxWinStreak}, Max LoseStreak: ${player.detail.maxLoseStreak}`);
    console.log(`Total Matches: ${player.detail.matches.length}`);
    console.log(`------------------------------------------`);

    player.detail.matches.forEach((match, idx) => {
        console.log(`Match ${match.matchId}: ${match.result} | Team: ${match.team} | Opponents: ${match.opponent.join(', ')} | Elo: ${match.currentElo}`);
    });
}

showLeaderboard();

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '🏟️  MatchSys> '
});

function resetSystem() {
    listPlayer.length = 0;
    listMatch.length = 0;
    createPlayer(nPlayer);
    createMatch(nMatch);
    console.log("🔄 Hệ thống đã được reset.");
}

function showMenu() {
    console.log(`
========= 📋 MENU =========
1. 🏆 Xem bảng xếp hạng (Leaderboard)
2. 🔍 Xem lịch sử người chơi
3. ➕ Thêm trận đấu
4. ➕ Thêm người chơi
5. 🔄 Reset hệ thống
6. ❌ Thoát
===========================
`);
    rl.question('👉 Nhập lựa chọn (1-6): ', handleMenu);
}

function handleMenu(choice) {
    switch (choice.trim()) {
        case '1':
            showLeaderboard();
            return showMenu();
        case '2':
            rl.question('🔎 Nhập ID người chơi: ', id => {
                showPlayerHistory(parseInt(id));
                showMenu();
            });
            break;
        case '3':
            rl.question('📦 Nhập số trận cần thêm: ', n => {
                createMatch(parseInt(n) || 10);
                console.log(`✅ Đã tạo ${n || 10} trận.`);
                showMenu();
            });
            break;
        case '4':
            rl.question('👥 Nhập số người chơi cần thêm: ', n => {
                const before = listPlayer.length;
                createPlayer(parseInt(n) || 10);
                console.log(`✅ Đã thêm ${listPlayer.length - before} người chơi.`);
                showMenu();
            });
            break;
        case '5':
            resetSystem();
            showMenu();
            break;
        case '6':
            rl.close();
            break;
        default:
            console.log('❌ Lựa chọn không hợp lệ. Vui lòng chọn số từ 1 đến 6.');
            showMenu();
    }
}

rl.on('close', () => {
    console.log('👋 Kết thúc hệ thống. Tạm biệt!');
    process.exit(0);
});

showMenu(); // Gọi lần đầu để hiển thị menu
