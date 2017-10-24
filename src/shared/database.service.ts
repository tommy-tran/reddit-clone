import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import * as firebase from 'firebase';
import { Subreddit } from "../models/subreddit.model";
import { Http } from "@angular/http";

@Injectable()
export class DatabaseService {
    constructor(private http: Http, ) {

    }
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
     * Check if current user has voted on specified post
     * @param username 
     * @param post 
     */
    checkVotedComment(username: string, comment: Comment, postId: string) {
        return new Promise<number>(resolve => {
            firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).once('value').then(comment => {
                let hasUpvotes = comment.val().hasOwnProperty("upvotes");
                let hasDownvotes = comment.val().hasOwnProperty("downvotes");
                if (hasUpvotes && comment.val().upvotes[username]) {
                    return resolve(0); // Found in upvotes
                }
                if (hasDownvotes && comment.val().downvotes[username]) {
                    return resolve(1); // Found in downvotes
                }
                return resolve(2); // Didn't vote
            }).catch(err => console.error(err));
        });
    }
    /**
     * Check upvoted post
     * @param username 
     * @param post 
     */
    checkUpvoted(username: string, post: Post) {
        return new Promise<boolean>(resolve => {
            firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).once('value').then(post => {
                let hasUpvotes = post.val().hasOwnProperty("upvotes");
                if (hasUpvotes && post.val().upvotes[username]) {
                    return resolve(true); // Found in upvotes
                }
                else {
                    return resolve(false);
                }
            }).catch(err => console.error(err));
        });
    }
    /**
     * Check downvoted post
     * @param username 
     * @param post 
     */
    checkDownvoted(username: string, post: Post) {
        return new Promise<boolean>(resolve => {
            firebase.database().ref("/posts/" + post.subreddit_id + "/" + post.post_id).once('value').then(post => {
                let hasDownvotes = post.val().hasOwnProperty("downvotes");
                if (hasDownvotes && post.val().downvotes[username]) {
                    return resolve(true); // Found in upvotes
                }
                else {
                    return resolve(false);
                }
            }).catch(err => console.error(err));
        });
    }
    /**
     * Check upvoted comment
     * @param username 
     * @param comment 
     */
    checkUpvotedComment(username: string, comment: Comment, postId: string) {
        return new Promise<boolean>(resolve => {
            firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).once('value').then(post => {
                let hasUpvotes = post.val().hasOwnProperty("upvotes");
                if (hasUpvotes && post.val().upvotes[username]) {
                    return resolve(true); // Found in upvotes
                }
                else {
                    return resolve(false);
                }
            }).catch(err => console.error(err));
        });
    }
    /**
     * Check downvoted comment
     * @param username 
     * @param comment 
     */
    checkDownvotedComment(username: string, comment: Comment, postId: string) {
        return new Promise<boolean>(resolve => {
            firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).once('value').then(comment => {
                let hasDownvotes = comment.val().hasOwnProperty("downvotes");
                if (hasDownvotes && comment.val().downvotes[username]) {
                    return resolve(true); // Found in upvotes
                }
                else {
                    return resolve(false);
                }
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
            }).catch(err => console.error(err));
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
            }).catch(err => console.error(err));
        });
    }
    /**
     * Update comment score
     * @param comment 
     * @param change 
     */
    updateCommentScore(comment: Comment, change: number, postId: string) {
        return new Promise<number>(resolve => {
            let ref = firebase.database().ref('comments/' + postId + "/comments/" + comment.comment_id + "/score");
            ref.transaction((score) => {
                return (score || 0) + change;
            }).catch(err => console.error(err));
        });
    }

    /**
     * Upvote a post
     * @param username 
     * @param post 
     */
    upvotePost(username: string, post: Post) {
        return new Promise<number>(resolve => {
            this.checkVotedPost(username, post).then((voted) => {
                let updates = {};
                switch (voted) {
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
            }).catch(err => console.error(err));
        });
    }

    /**
     * Downvote a post
     * @param username 
     * @param post 
     */
    downvotePost(username: string, post: Post) {
        return new Promise<number>(resolve => {
            this.checkVotedPost(username, post).then((voted) => {
                let updates = {};
                switch (voted) {
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
            }).catch(err => console.error(err));
        });
    }
    /**
     * Upvote a comment
     * @param username user that upvoted the comment
     * @param comment comment to be upvoted
     */
    upvoteComment(username: string, comment: Comment, postId: string) {
        return new Promise<number>(resolve => {
            this.checkVotedComment(username, comment, postId).then((voted) => {
                let updates = {};
                switch (voted) {
                    case 0: // upvoted --> take away upvote
                        updates["/upvotes/" + username] = null;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, - 1, postId);
                        this.userKarmaUpdate(comment.UID, - 1);
                        return resolve(-1);
                    case 1: // downvoted
                        updates["/upvotes/" + username] = true;
                        updates["/downvotes/" + username] = null;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, + 2, postId);
                        this.userKarmaUpdate(comment.UID, + 2);
                        return resolve(2);
                    case 2: // no vote
                        updates["/upvotes/" + username] = true;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, + 1, postId);
                        this.userKarmaUpdate(comment.UID, + 1);
                        return resolve(1);
                }
            }).catch(err => console.error(err));
        })
    }

    /**
     * Downvote a post
     * @param username 
     * @param post 
     */
    downvoteComment(username: string, comment: Comment, postId: string) {
        return new Promise<number>(resolve => {
            this.checkVotedComment(username, comment, postId).then((voted) => {
                let updates = {};
                switch (voted) {
                    case 0: // upvoted
                        updates["/upvotes/" + username] = null;
                        updates["/downvotes/" + username] = true;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, - 2, postId);
                        this.userKarmaUpdate(comment.UID, - 2);
                        return resolve(-2);
                    case 1: // downvoted --> take away downvote
                        updates["/downvotes/" + username] = null;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, + 1, postId);
                        this.userKarmaUpdate(comment.UID, + 1);
                        return resolve(1);
                    case 2: // no vote
                        updates["/downvotes/" + username] = true;
                        firebase.database().ref("/comments/" + postId + "/comments/" + comment.comment_id).update(updates);
                        this.updateCommentScore(comment, - 1, postId);
                        this.userKarmaUpdate(comment.UID, - 1);
                        return resolve(-1);
                }
            }).catch(err => console.error(err));
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
     * Get a comment by a post id
     * @param postId 
     * @param comment 
     */
    getComment(postId: string, commentId: string) {
        return new Promise<Comment>(resolve => {
            firebase.database().ref('comments/' + postId + "/comments/" + commentId).once('value').then(comment => {
                return resolve(comment.val());
            }).catch(err => console.error(err));
        });
    }

    /**
     * return a JSON obj of a subreddit
     * @param subreddit_id 
     */
    getSubreddit(subreddit_id: string) {
        return new Promise<Subreddit[]>(resolve => {
            var database = firebase.database();
            database.ref('subreddits/' + subreddit_id).once('value').then(subreddit => {
                console.log(subreddit.val());
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
        });
    }
    /**
     * get JSON obj of comments on a post by its id
     * @param subredditId id of the subreddit the post is in
     * @param postId id of the post
     */
    getPostComments(postId: string) {
        return new Promise<Comment[]>(resolve => {
            var database = firebase.database();
            database.ref('comments/' + postId + '/comments/').once('value').then(comments => {
                console.log(comments.val());
                return resolve(comments.val());
            }).catch(err => console.error(err));
        });
    }
    /**
     * create a new subreddit
     * @param subredditName name of the new subreddit
     * @param subredditDescription description of the new subreddit
     * @param username username of the creator
     * @param user_id user_id of the creator
     */
    newSubreddit(subredditName: string, subredditDescription: string, username: string, user_id: string) {
        return new Promise(resolve => {
            let key = firebase.database().ref('subreddits').push().key;
            console.log(key);
            let subreddit = new Subreddit(
                subredditName,
                subredditDescription,
                user_id,
                username,
                key
            );
            firebase.database().ref('subreddits/' + key).update(subreddit);
            resolve();
        });

    }
    /**
     * Write a post to a subreddit
     * @param post post to be written
     * @param subredditId id of the subreddit to write the post
     */
    createLinkPost(postData: any) {
        return new Promise(resolve => {
            let key = firebase.database().ref('posts/' + postData.subreddit.subreddit_id + '/').push().key;
            console.log(postData);
            let upvote = {};
            upvote[postData.username]  = true;
            let post = new Post(
                postData.title,
                postData.link,
                key,
                null,
                postData.subreddit.name,
                postData.subreddit.subreddit_id,
                firebase.database.ServerValue.TIMESTAMP,
                postData.username,
                postData.user_id,
                1,
                0
            );
            post["upvotes"] = upvote;
            firebase.database().ref('posts/' + postData.subreddit.subreddit_id + '/' + key).update(post).catch(err => console.error(err));
            resolve();
        });
    }
    /**
 * Write a post to a subreddit
 * @param post post to be written
 * @param subredditId id of the subreddit to write the post
 */
    createTextPost(postData: any) {
        return new Promise(resolve => {
            let key = firebase.database().ref('posts/' + postData.subreddit.subreddit_id + '/').push().key;
            let upvote = {};
            upvote[postData.username] = true;
            console.log(key);
            let post = new Post(
                postData.title,
                null,
                key,
                postData.message,
                postData.subreddit.name,
                postData.subreddit.subreddit_id,
                firebase.database.ServerValue.TIMESTAMP,
                postData.username,
                postData.user_id,
                1,
                0
            );
            post["upvotes"] = upvote;

            console.log(post);
            firebase.database().ref('posts/' + postData.subreddit.subreddit_id + '/' + key).update(post).catch(err => console.error(err));
            resolve();
        });
    }
    /**
     * write a comment on a post
     * @param commentData comment to be written
     * @param postId id of the post the comment is being written to
     */
    writeComment(commentData: any, postId: string, subredditId: string) {
        return new Promise(resolve => {
            let key = firebase.database().ref('comments/' + postId + '/comments/').push().key;
            let comment = new Comment(
                commentData.message,
                firebase.database.ServerValue.TIMESTAMP,
                commentData.creator,
                commentData.UID,
                key,
                commentData.score
            );
            firebase.database().ref('comments/' + postId + '/comments/' + key).update(comment).catch(err => console.error(err));

            // Increment comment counter in posts
            let ref = firebase.database().ref('posts/' + subredditId + "/" + postId + "/numcomments");
            ref.transaction((comments) => {
                return (comments || 0) + 1;
            }).catch(err => console.error(err));


            resolve(comment);
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
     * @param postId id of the post
     * @param comment comment to be deleted
     */
    deleteComment(subredditId: string, postId: string, comment: Comment) {
        firebase.database().ref('comments/' + postId + '/' + comment.comment_id)
            .remove().then(() => {
                console.log('delete success');
            }).catch(err => console.error(err));
        //OR
        firebase.database().ref('comments/' + postId + '/' + comment.comment_id)
            .set({
                message: "[removed]",
                timestamp: null,
                upvotes: null,
                user: null
            }).then(() => {
                console.log('delete success');
            }).catch(err => console.error(err));
    }

    getPostCommentsLength(postId) {
        // return new Promise(resolve => {
        //     this.http.get(`https://reddit-clone-ced0e.firebaseio.com/comments/${postId}?shallow=true`)
        //         .subscribe(response => resolve(response.json()));
        // });
    }

}