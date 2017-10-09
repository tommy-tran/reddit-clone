export class Post {
    title: string;
    media: string;
    message: string;
    postId: string;
    subreddit: string;
    timestamp: number;
    upvotes: number;
    user: string;
    numcomments: number;
    constructor(title: string, media: string, postId: string, message: string, submessage: string, subreddit: string, timestamp: number, upvotes: number, user: string, numcomments: number) {
        this.title = title;
        this.media = media;
        this.postId = postId;
        this.message = message;
        this.subreddit = subreddit;
        this.timestamp = timestamp;
        this.upvotes = upvotes;
        this.user = user;
        this.numcomments = numcomments;
    }
}