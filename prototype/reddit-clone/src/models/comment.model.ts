export class Comment {
    comment_id: string;
    message: string;
    timestamp: any;
    score: number;
    creator: string;
    UID: string;
    constructor(message: string, timestamp: any, creator: string, UID: string, comment_id: string, score: number) {
        this.message = message;
        this.timestamp = timestamp;
        this.creator = creator;
        this.UID = UID;
        this.comment_id = comment_id;
        this.score = score;
    }
}