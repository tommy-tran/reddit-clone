export class Post {
    title: string;
    link: string;
    message: string;
    post_id: string;
    subreddit: string;
    subreddit_id: string;
    timestamp: number;
    score: number;
    user: string;
    user_id: string;
    numcomments: number;
    constructor(
        title: string, 
        link: string, 
        post_id: string,
        message: string, 
        subreddit: string, 
        subreddit_id: string, 
        timestamp: any,
        user: string,
        user_id: string,
        score: number,
        numcomments: number) {
            this.title = title;
            this.link = link;
            this.post_id = post_id;
            this.message = message;
            this.subreddit = subreddit;
            this.subreddit_id = subreddit_id;
            this.timestamp = timestamp;
            this.user = user;
            this.user_id = user_id;
            this.score = score;
            this.numcomments = numcomments;
    }
}