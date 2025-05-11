export class Player {
    constructor(id) {
        this.id = id;
        this.name = `Player ${id}`;
        this.status = Math.round(Math.random());
        this.eloScore = this.status === 0 ? 1200 : Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        this.detail = {
            matches: [],
            winCount: 0,
            loseCount: 0,
            winStreak: 0,
            loseStreak: 0,
            maxWinStreak: 0,
            maxLostStreak: 0,
        };
    }
}