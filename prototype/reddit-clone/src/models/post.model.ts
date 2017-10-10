export class Post {
    title: string;
    media: string;
    message: string;
    post_id: string;
    subreddit: string;
    subreddit_id: string;
    timestamp: number;
    upvotes: {key : boolean};
    downvotes: {key : boolean};
    score: number;
    user: string;
    user_id: string;
    numcomments: number;
    constructor(
        title: string, 
        media: string, 
        post_id: string, 
        message: string, 
        subreddit: string, 
        subreddit_id: string, 
        timestamp: number, 
        upvotes: {key: boolean},
        downvotes: {key : boolean},
        score: number,
        user: string,
        user_id: string, 
        numcomments: number) {
            this.title = title;
            this.media = media;
            this.post_id = post_id;
            this.message = message;
            this.subreddit = subreddit;
            this.subreddit_id = subreddit_id;
            this.timestamp = timestamp;
            this.upvotes = upvotes;
            this.downvotes = downvotes;
            this.score = score;
            this.user = user;
            this.user_id = user_id;
            this.numcomments = numcomments;
    }
}