import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { DatabaseService } from '../../shared/database.service';


@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  post: Post;
  comments: Comment[];
  constructor(public navCtrl: NavController,private databaseService: DatabaseService, public navParams: NavParams) {
    this.post = this.navParams.data.post;
    console.log(this.post);
    this.getPostComments();
  }

  getPostComments() {
    this.databaseService.getPostComments(this.post.post_id).then((comments) => {
      console.log(comments);
      this.comments = [];
      for (var key in comments) {
        this.comments.push(comments[key]);
      }
    });
  }

}
