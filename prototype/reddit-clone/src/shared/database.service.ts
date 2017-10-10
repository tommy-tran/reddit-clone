import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import * as firebase from 'firebase';
import { Subreddit } from "../models/subreddit.model";

@Injectable()
export class DatabaseService {

    /**
     * Check if current user has voted on specified post
     * @param username 
     * @param post 
     */
    checkVotedPost(username: string, post: Post) {
        return new Promise<number>(resolve => {
            firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).once('value').then(post => {
                let hasUpvotes = post.val().hasOwnProperty("upvotes");
                let hasDownvotes = post.val().hasOwnProperty("downvotes");
                if (hasUpvotes && post.val().upvotes[username]) {
                    return resolve(0); // Found in upvotes
                }
                if (hasDownvotes && post.val().downvotes[username]) {       
                    return resolve(1); // Found in downvotes
                }   
                return resolve(2); // Didn't vote
            }).catch(err => console.error(err));
        });
    }

    /**
     * Update users karma points
     * @param user_id 
     * @param change 
     */
    userKarmaUpdate(user_id: string, change: number) {
        return new Promise<number>(resolve => {
            let ref = firebase.database().ref('users/' + user_id + "/karma");
            ref.transaction((karma) => {
                return (karma || 0) + change;   
            })
        });
    }

    /**
     * Update post score
     * @param post_id 
     * @param change 
     */
    updatePostScore(post: Post, change: number) {
        return new Promise<number>(resolve => {
            let ref = firebase.database().ref('posts/' + post.subreddit_id + "/" + post.post_id + "/score");
            ref.transaction((score) => {
                return (score || 0) + change;   
            })
        });
    }

    /**
     * Upvote a post
     * @param username 
     * @param post 
     */
    upvotePost(username : string, post: Post) {
        return new Promise<number>(resolve => {
            this.checkVotedPost(username, post).then((voted) => {
                let updates = {};
                switch(voted) {
                    case 0: // upvoted --> take away upvote
                        updates["/upvotes/" + username] = null;                        
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, - 1);
                        this.userKarmaUpdate(post.user_id, - 1);
                        return resolve(-1);
                    case 1: // downvoted
                        updates["/upvotes/" + username] = true;
                        updates["/downvotes/" + username] = null;
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, + 2);
                        this.userKarmaUpdate(post.user_id, + 2);
                        return resolve(2);
                    case 2: // no vote
                        updates["/upvotes/" + username] = true;
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, + 1);
                        this.userKarmaUpdate(post.user_id, + 1);
                        return resolve(1);
                }
            });
        });
    }

    /**
     * Downvote a post
     * @param username 
     * @param post 
     */
    downvotePost(username : string, post: Post) {
        return new Promise<number>(resolve => {
            this.checkVotedPost(username, post).then((voted) => {
                let updates = {};
                switch(voted) {
                    case 0: // upvoted
                        updates["/upvotes/" + username] = null;
                        updates["/downvotes/" + username] = true;
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, - 2);
                        this.userKarmaUpdate(post.user_id, - 2);
                        return resolve(-2);
                    case 1: // downvoted --> take away downvote
                        updates["/downvotes/" + username] = null;
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, + 1);
                        this.userKarmaUpdate(post.user_id, + 1);
                        return resolve(1);
                    case 2: // no vote
                        updates["/downvotes/" + username] = true;
                        firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).update(updates);
                        this.updatePostScore(post, - 1);
                        this.userKarmaUpdate(post.user_id, - 1);
                        return resolve(-1);
                }
            });
        });
    }

    /**
     * Get a post from specified subreddit
     * @param post_id 
     * @param subreddit_id 
     */
    getPost(post_id: string, subreddit_id) {
        return new Promise<Post>(resolve => {
            firebase.database().ref('posts/' + subreddit_id + "/" + post_id).once('value').then(post => {
                return resolve(post.val());
            }).catch(err => console.error(err));
        });
    }

    /**
     * return a JSON obj of a subreddit
     * @param subreddit_id 
     */
    getSubreddit(subreddit_id : string) {
        return new Promise<Subreddit[]>(resolve => {
            var database = firebase.database();
            database.ref('subreddits/' + subreddit_id).once('value').then(subreddit => {
                return resolve(subreddit.val());
            }).catch(err => console.error(err));
        });
    }
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
     * return a JSON obj of posts from all subreddits
     */
    getAllPosts() {
        return new Promise<Post[]>(resolve => {
            var database = firebase.database();
            database.ref('posts/').once('value').then(posts => {
                return resolve(posts.val());
            }).catch(err => console.error(err));
        });
    }
    /**
     * return a JSON obj of all posts in a subreddit
     * @param subredditId id of the subreddit
     */
    getSubredditPosts(subredditId: string) {
        return new Promise<Post[]>(resolve => {
            var database = firebase.database();
            database.ref('posts/' + subredditId).once('value').then(posts => {
                return resolve(posts.val());
            }).catch(err => console.error(err));
        })
    }
    /**
     * get JSON obj of comments on a post by its id
     * @param subredditId id of the subreddit the post is in
     * @param postId id of the post
     */
    getPostComments(subredditId: string, postId: string) {
        return new Promise<Comment[]>(resolve => {
            var database = firebase.database();
            database.ref('subreddit-data/' + subredditId + '/comments/' + postId).once('value').then(comments => {
                console.log(comments.val());
                return resolve(comments.val());
            }).catch(err => console.error(err));
        })
    }
    /**
     * create a new subreddit
     * @param subredditId id of the new subreddit
     * @param subredditName name of the new subreddit
     */
    newSubreddit(subredditId: string, subredditName: string) {
        firebase.database().ref('subreddits/').set({
            id: subredditId,
            name: subredditName
        });
    }
    /**
     * Write a post to a subreddit
     * @param post post to be written
     * @param subredditId id of the subreddit to write the post
     */
    writePost(post: Post, subredditId: string) {
        firebase.database().ref('posts/' + subredditId).set({
            message: post.message,
            postId: post.post_id,
            subreddit: post.subreddit,
            timestamp: post.timestamp,
            upvotes: post.upvotes,
            user: post.user
        });
    }
    /**
     * write a comment on a post
     * @param comment comment to be written
     * @param postId id of the post the comment is being written to
     * @param subredditId id of the subreddit the post is in
     */
    writeComment(comment: Comment, postId: string, subredditId: string) {
        firebase.database().ref('subreddit-data/' + subredditId + '/comments/' + postId).set({
            message: comment.message,
            timestamp: comment.timestamp,
            upvotes: comment.upvotes,
            user: comment.user
        });
    }
    /**
     * delete a subreddit by its id.
     * @param subredditId id of the subreddit
     */
    deleteSubreddit(subredditId) {
        firebase.database().ref('subreddit-data/' + subredditId).remove().then(() => {
            console.log('delete success');
        }).catch(err => console.error(err));
    }
    /**
     * delete a post
     * @param subredditId id of the subreddit
     * @param postId id of the post
     */
    deletePost(subredditId, postId) {
        //delete posts
        firebase.database().ref('subreddit-data/' + subredditId + '/posts/' + postId).remove().then(() => {
            console.log('delete post success');
        }).catch(err => console.error(err)).then(() => {
            //now delete post comments
            firebase.database().ref('subreddit-data/' + subredditId + '/comments/' + postId).remove().then(() => {
                console.log('delete comments success');
            }).catch(err => console.error(err))
        });
    }
    /**
     * remove a comment
     * @param subredditId id of the subreddit
     * @param postId id of the post
     * @param commentIndex id of the
     */
    deleteComment(subredditId: string, postId: string, commentIndex: string) {
        firebase.database().ref('subreddit-data/' + subredditId + '/comments/' + postId + '/' + commentIndex)
            .remove().then(() => {
                console.log('delete success');
            }).catch(err => console.error(err));
        firebase.database().ref('subreddit-data/' + subredditId + '/comments/' + postId + '/' + commentIndex)
            .set({
                message: "[removed]",
                timestamp: null,
                upvotes: null,
                user: null
            }).then(() => {
                console.log('delete success');
            }).catch(err => console.error(err));
    }

}