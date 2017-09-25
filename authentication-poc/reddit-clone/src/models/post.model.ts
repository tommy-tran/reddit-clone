export class Post {
    postId: string;
    message: string;
    submessage: string;
    subreddit: string;
    timestamp: number;
    upvotes: number;
    user: string;
    constructor(postId: string, message: string, submessage: string, subreddit: string, timestamp: number, upvotes: number, user: string) {
        this.postId = postId;
        this.message = message;
        this.submessage = submessage;
        this.subreddit = subreddit;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.user = user;
    }
}