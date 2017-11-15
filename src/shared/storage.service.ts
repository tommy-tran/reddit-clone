import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class StorageService {
    subreddits: any[];
    initSubreddits: any[];
    constructor(private storage: Storage) { }
    /**
     * set the user's subscribed subreddits
     * @param subscribedSubreddits user's subscribed subreddits
     */
    setSubscribedSubreddits(subscribedSubreddits: any[]) {
        return new Promise(resolve => {
            this.subreddits = subscribedSubreddits;
            this.storage.set('subscribedSubreddits', subscribedSubreddits)
                .catch(err => console.error(err));
            resolve();
        });
    }
    /**
     * get users subreddits from storage
     */
    getSubscribedSubreddits() {
        return new Promise<Array<any>>(resolve => {
            this.storage.get('subscribedSubreddits').then(subreddits => {
                if (subreddits) {
                    this.subreddits = subreddits;
                    return resolve(this.subreddits);
                }
                else {
                    return resolve(null);
                }
            }).catch(err => console.error(err));
        });
    }
    /**
     * check if user is subscribed to a subreddit
     * @param subreddit_id subreddit id
     */
    isSubscribed(subreddit_id: string) {
        if (!this.subreddits) {
            this.getSubscribedSubreddits().then(() => {
                for (let i = 0; i < this.subreddits.length; i++) {
                    if (subreddit_id == this.subreddits[i].subreddit_id) {
                        return true;
                    }
                }
                return false;
            });
        }
        else {
            for (let i = 0; i < this.subreddits.length; i++) {
                if (subreddit_id == this.subreddits[i].subreddit_id) {
                    return true;
                }
            }
            return false;
        }
    }

    setInitSubreddits(subreddits: any[]) {
        this.initSubreddits = subreddits;
    }

    getInitSubreddits() {
        return this.initSubreddits;
    }
}