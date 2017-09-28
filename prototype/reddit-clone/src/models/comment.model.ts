export class Comment {
    message: string;
    timestamp: number;
    upvotes: number;
    user: string
    constructor(message: string, timestamp: number, upvotes: number, user: string) {
        this.message = message;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.user = user;
    }
}