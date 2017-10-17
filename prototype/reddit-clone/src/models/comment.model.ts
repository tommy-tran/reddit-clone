export class Comment {
    comment_id: string;
    message: string;
    timestamp: number;
    upvotes: {key : boolean};
    downvotes: {key : boolean};
    score: number;
    creator: string;
    UID: string;
    constructor(message: string, timestamp: number, upvotes: {key: boolean}, creator: string, UID: string, comment_id: string, downvotes: {key: boolean}, score: number) {
        this.message = message;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.creator = creator;
        this.UID = UID;
        this.comment_id = comment_id;
        this.downvotes = downvotes;
        this.score = score;
    }
}