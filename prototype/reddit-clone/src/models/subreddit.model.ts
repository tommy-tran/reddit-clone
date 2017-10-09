export class Subreddit {
    name: string;
    description: string;
    UID: string; // UID of creator
    creator: string;
    subreddit_id: string;

    constructor(name: string, description: string, uid: string, creator: string, subreddit_id: string) {
        this.name = name;
        this.description = description;
        this.UID = uid;
        this.creator = creator;
        this.subreddit_id = subreddit_id;
    }
}