import { getRandomElements } from './utils.js'; // utility function to get random team members

export class Match {
    constructor(id, teamA, teamB) {
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.winner = Math.random() < 0.5 ? 'A' : 'B';

    }

    getAllPlayer(){
        return [...this.teamA, ...this.teamB];
    }
}