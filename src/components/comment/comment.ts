import { Component, Input } from "@angular/core";
import { Comment } from "../../models/comment.model";
import { NavParams, AlertController, ModalController, Events } from "ionic-angular";
import { AuthService } from "../../shared/auth.service";
import { DatabaseService } from "../../shared/database.service";
import { LoginPage } from "../../shared/pages";
@Component({
  selector: 'comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {
  datePosted: string;
  userHasAccount: any;
  @Input() comment: Comment;
  @Input() postId: string;
  @Input() color: string;
  @Input() showDeleteBtn: boolean;
  disableInput: boolean;
  isLoggedIn: boolean;
  score: number;
  userDownvoted: boolean;
  userUpvoted: boolean;
  constructor(
    private alertCtrl: AlertController, 
    private authService: AuthService, 
    private databaseService: DatabaseService, 
    private events: Events,
    private modalCtrl: ModalController, 
    public navParams: NavParams) {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in    
    this.disableInput = false; // For temporary disable input on upvotes/downvotes
  }
  ngOnInit() {
    this.score = this.comment.score;
    let user = this.authService.getUsername();

    //initialize posts upvotes and downvotes
    this.databaseService.checkUpvotedComment(user, this.comment, this.postId).then(boolean => {
      this.userUpvoted = boolean;
    });
    this.databaseService.checkDownvotedComment(user, this.comment, this.postId).then(boolean => {
      this.userDownvoted = boolean;
    });
    this.calculateDatePosted();
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
    this.databaseService.getComment(this.postId, this.comment.comment_id).then((comment) => {
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
  calculateDatePosted() {
    let currentTime = new Date();
    let difference = currentTime.getTime() - this.comment.timestamp;

    let yearsDifference = Math.floor(difference / 1000 / 60 / 60 / 24 / 365);
    difference -= yearsDifference * 1000 * 60 * 60 * 24 * 365;

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    let minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    let secondsDifference = Math.floor(difference / 1000);

    if (yearsDifference > 1) {
      this.datePosted = yearsDifference + ' years ago';
    }
    else if (yearsDifference == 1) {
      this.datePosted = '1 year ago';
    }
    else if (daysDifference > 1) {
      this.datePosted = daysDifference + ' days ago';
    }
    else if (daysDifference == 1) {
      this.datePosted = '1 day ago';
    }
    else if (hoursDifference > 1 && hoursDifference < 24) {
      this.datePosted = hoursDifference + ' hours ago';
    }
    else if (hoursDifference === 1) {
      this.datePosted = '1 hour ago';
    }
    else if (minutesDifference < 60 && minutesDifference >= 1) {
      this.datePosted = minutesDifference + ' minutes ago';
    }
    else {
      this.datePosted = secondsDifference + ' seconds ago';
    }
  }

  deleteComment() {
    this.alertCtrl.create({
      title: "Deletion confirmation",
      subTitle: "Are you sure you want to delete this comment?",
      buttons: [
        {
          text: 'Confirm',
          handler: data => {
            this.databaseService.deleteComment(this.postId,this.comment.comment_id).then(() => {
              this.events.publish('update:comments')
            })
          }
        },
        {
          text: 'Cancel'
        }
      ]
    }).present();
  }
}