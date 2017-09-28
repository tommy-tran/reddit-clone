export class Post {
    media: string;
    message: string;
    postId: string;
    submessage: string;
    subreddit: string;
    timestamp: number;
    upvotes: number;
    user: string;
    constructor(media: string, postId: string, message: string, submessage: string, subreddit: string, timestamp: number, upvotes: number, user: string) {
        this.media = media;
        this.postId = postId;
        this.message = message;
        this.submessage = submessage;
        this.subreddit = subreddit;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.user = user;
    }
}