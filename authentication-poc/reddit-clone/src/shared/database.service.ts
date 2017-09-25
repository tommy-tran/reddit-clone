import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import * as firebase from 'firebase';
import { Subreddit } from "../models/subreddit.model";

@Injectable()
export class DatabaseService {
    /**
     * return a JSON obj of subreddits from the database
     */
    getSubreddits() {
        return new Promise<Subreddit[]>(resolve => {
            var database = firebase.database();
            database.ref('subreddits/').once('value').then(subreddits => {
                return resolve(subreddits.val());
            }).catch(err => console.error(err));
        });
    }
    /**
     * return a JSON obj of all posts in a subreddit
     * @param subredditId id of the subreddit
     */
    getSubredditPosts(subredditId) {
        return new Promise<Post[]>(resolve => {
            var database = firebase.database();
            database.ref('subreddit-data/' + subredditId + '/posts').once('value').then(posts => {
                console.log(posts.val());
                return resolve(posts.val());
            }).catch(err => console.error(err));
        })
    }
}