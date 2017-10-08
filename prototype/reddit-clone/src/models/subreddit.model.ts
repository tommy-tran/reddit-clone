export class Subreddit {
    name: string;
    description: string;
    UID: string; // UID of creator

    constructor(name: string, description: string, uid: string) {
        this.name = name;
        this.description = description;
        this.UID = uid;
    }
}