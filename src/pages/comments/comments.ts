import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { DatabaseService } from '../../shared/database.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  post: Post;
  comments: Comment[];
  @ViewChild('myInput') myInput: ElementRef;
  constructor(private authService: AuthService, public navCtrl: NavController, private databaseService: DatabaseService, public navParams: NavParams) {
    this.post = this.navParams.data.post;
    console.log(this.post);
    this.getPostComments();
  }
  /**
   * for resizing textarea as user types
   */
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  /**
   * add a comment to a post
   * @param form comment message to be added
   */
  submitComment(form: NgForm) {
    if (form.value.commentInput.trim()) {
      let commentData = {
        creator: this.authService.getUsername(),
        UID: this.authService.getUID(),
        message: form.value.commentInput.trim(),
        score: 0
      }
      this.databaseService.writeComment(commentData, this.post.post_id).then((comment: Comment) => {
        this.comments.push(comment);
      });

    }
  }
  /**
   * get all comments for a post
   */
  getPostComments() {
    this.databaseService.getPostComments(this.post.post_id).then((comments) => {
      this.comments = [];
      for (var key in comments) {
        this.comments.push(new Comment(
          comments[key].message,
          comments[key].timestamp,
          comments[key].creator,
          comments[key].UID,
          comments[key].comment_id,
          comments[key].score
        ));
      }
    });
  }

}
