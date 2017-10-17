export class Comment {
    message: string;
    timestamp: number;
    upvotes: number;
    creator: string;
    UID: string;
    constructor(message: string, timestamp: number, upvotes: number, creator: string, UID: string) {
        this.message = message;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.creator = creator;
        this.UID = UID;
    }
}