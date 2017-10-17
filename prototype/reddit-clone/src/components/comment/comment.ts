import { Component, Input } from "@angular/core";
import { Comment } from "../../models/comment.model";
import { NavParams, AlertController, ModalController } from "ionic-angular";
import { AuthService } from "../../shared/auth.service";
import { DatabaseService } from "../../shared/database.service";
import { LoginPage } from "../../shared/pages";
@Component({
  selector: 'comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {
  userHasAccount: any;
  @Input() comment: Comment;
  @Input() postId: string;
  disableInput: boolean;
  isLoggedIn: boolean;
  score: number;
  userDownvoted: boolean;
  userUpvoted: boolean;
  constructor(private alertCtrl: AlertController, private authService: AuthService, private databaseService: DatabaseService, private modalCtrl: ModalController, public navParams: NavParams) {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in    
    this.disableInput = false; // For temporary disable input on upvotes/downvotes
  }

  upvote() {
    if (this.isLoggedIn) {
      this.disableInput = true;
      let user = this.authService.getUsername();
      this.databaseService.upvoteComment(user, this.comment, this.postId).then((points) => {
        this.score = this.score + points;

        this.databaseService.checkUpvotedComment(user, this.comment, this.postId).then(boolean => {
          this.userUpvoted = boolean;
        });
        this.databaseService.checkDownvotedComment(user, this.comment, this.postId).then(boolean => {
          this.userDownvoted = boolean;
        });
        this.updateComment();

      });
    } else {
      console.log("not logged in");
      const alert = this.alertCtrl.create({
        title: "Not Logged In",
        subTitle: "Please log in to upvote and downvote posts, as well as create your own subreddits, posts, and comments!",
        buttons: [
          {
            text: 'Log In/Sign Up',
            role: 'login',
            handler: data => {
              this.openAuth();
            }
          },
          {
            text: 'Dismiss'
          }
        ]
      });
      alert.present();
    }
  }

  downvote() {
    if (this.isLoggedIn) {
      this.disableInput = true;
      let user = this.authService.getUsername();
      this.databaseService.downvoteComment(user, this.comment, this.postId).then((points) => {
        this.score = this.score + points;
        this.databaseService.checkDownvotedComment(user, this.comment, this.postId).then(boolean => {
          this.userDownvoted = boolean;
        });
        this.databaseService.checkUpvotedComment(user, this.comment, this.postId).then(boolean => {
          this.userUpvoted = boolean;
        });
        this.updateComment();
      });
    } else {
      console.log("not logged in");
      const alert = this.alertCtrl.create({
        title: "Not Logged In",
        subTitle: "Please log in to upvote and downvote posts, as well as create your own subreddits, posts, and comments!",
        buttons: [
          {
            text: 'Log In/Sign Up',
            role: 'login',
            handler: data => {
              this.openAuth();
            }
          },
          {
            text: 'Dismiss'
          }
        ]
      });
      alert.present();
    }

  }

  updateComment() {
    this.databaseService.getComment(this.comment.UID, this.postId).then((comment) => {
      this.comment = comment;
      this.disableInput = false;
    })
  }

  /**
* open the login/signup page
*/
  openAuth() {
    let param = { userHasAccount: this.userHasAccount };
    let authModal = this.modalCtrl.create(LoginPage, param);
    authModal.present();
    authModal.onWillDismiss((isLoggedIn) => {
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        console.log("loggedin: " + this.isLoggedIn);
      }
    });
  }
}