import { Player } from './Player.js';
import { Match } from './Match.js';
import { Stats } from './Stats.js';
import { SysElo } from './SysElo.js';
import { getRandomElements } from './utils.js';

const listPlayer = [];
for (let i = 1; i <= 100; i++) {
    listPlayer.push(new Player(i));
}
//console.log(listPlayer);
// Tạo các trận đấu không trùng người chơi trong 1 lượt 10 trận
const matches = [];
let matchId = 1;

for (let i = 0; i < 100; i++) {
    const batchPlayers = getRandomElements(listPlayer, 100); // 10 trận mỗi trận 10 người = 100 người/lượt

    for (let j = 0; j < 10; j++) {
        const start = j * 10;
        const playersInMatch = batchPlayers.slice(start, start + 10);
        const teamA = playersInMatch.slice(0, 5);
        const teamB = playersInMatch.slice(5, 10);
        matches.push(new Match(matchId++, teamA, teamB));
    }
}

// Stats: xử lý thông tin trận đấu
const stats = new Stats(listPlayer, matches);
stats.processMatchResults();

// Elo: tính điểm ELO
const elo = new SysElo();
elo.processAll(matches);

// // In ra một số kết quả demo
//console.log(listPlayer); // Xem detail người chơi số 1
// console.log(matches[0]);    // Xem thông tin trận đầu tiên