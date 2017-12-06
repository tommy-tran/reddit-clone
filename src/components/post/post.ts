import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';
import { AuthService } from '../../shared/auth.service';
import { NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { LoginPage, CommentsPage } from "../../shared/pages";
import { Subreddit } from '../../models/subreddit.model';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnInit {
  score: number;
  commentCount: number;
  datePosted: string;
  isLoggedIn: boolean;
  disableInput: boolean;
  userHasAccount: boolean;
  userUpvoted: boolean;
  userDownvoted: boolean;
  
  @Input() post: Post;
  @Input() isCardLayout: boolean;
  @Input() isMobile: boolean;
  @Input() showCommentBtn: boolean;
  @Input() subreddit: Subreddit;
  @Input() commentPage: boolean;
  @Input() showDeleteBtn: boolean;

  constructor(private authService: AuthService, 
    private databaseService: DatabaseService,
    public events: Events,
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public modalCtrl: ModalController) {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in    
    this.disableInput = false; // For temporary disable input on upvotes/downvotes
  }
  /**
   * calculate the date from a timestamp
   */
  calculateDatePosted() {
    let currentTime = new Date();
    let difference = currentTime.getTime() - this.post.timestamp;

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
  /**
   * init the post
   */
  ngOnInit() {
    this.score = this.post.score;
    this.calculateDatePosted();
    let user = this.authService.getUsername();
    //initialize posts upvotes and downvotes
    this.databaseService.checkUpvoted(user, this.post).then(boolean => {
      this.userUpvoted = boolean;
    });
    this.databaseService.checkDownvoted(user, this.post).then(boolean => {
      this.userDownvoted = boolean;
    });
    // this.databaseService.getPostCommentsLength(this.post.post_id).then(count => {
    //   for (var key in count) {
    //     this.commentCount++;
    //   }
    // });
  }
  /**
   * go to a posts subreddit
   */
  goToSubreddit() {
    this.databaseService.getSubreddit(this.post.subreddit_id).then((subreddit) => {
      this.navCtrl.push('subreddit', subreddit);
    });
  }
  /**
   * visit a posts attached url link
   */
  goToLink() {
    if (this.post.link) {
      window.open(this.post.link);
    } else {
      console.log(this.commentPage);
      this.showComments();
    }

  }
  /**
   * upvote the post
   */
  upvote() {
    if (this.isLoggedIn){
      this.disableInput = true;
      let user = this.authService.getUsername();
      this.databaseService.upvotePost(user, this.post).then((points) => {
        this.score = this.score + points;
        
        this.databaseService.checkUpvoted(user, this.post).then(boolean => {
          this.userUpvoted = boolean;
        });
        this.databaseService.checkDownvoted(user, this.post).then(boolean => {
          this.userDownvoted = boolean;
        });
        this.updatePost();   
      });
    } else{
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
  /**
   * downvote the post
   */
  downvote() {
    if (this.isLoggedIn){
      this.disableInput = true;
      let user = this.authService.getUsername();
      this.databaseService.downvotePost(user, this.post).then((points) => {
        this.score = this.score + points;
        this.databaseService.checkDownvoted(user, this.post).then(boolean => {
          this.userDownvoted = boolean;
        });
        this.databaseService.checkUpvoted(user, this.post).then(boolean => {
          this.userUpvoted = boolean;
        });
        this.updatePost();
      });
    } else{
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
  /**
   * re-pull the post from db
   */
  updatePost() {
    this.databaseService.getPost(this.post.post_id, this.post.subreddit_id).then((post) => {
      this.post = post;
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
        console.log("loggedin: " +this.isLoggedIn);
      }
    });
  }

  showComments() {
    this.navCtrl.push(CommentsPage, {post: this.post});
  }

  deletePost() {
    this.alertCtrl.create({
      title: "Deletion confirmation",
      subTitle: "Are you sure you want to delete this post?",
      buttons: [
        {
          text: 'Confirm',
          handler: data => {
            this.databaseService.deletePost(this.post.subreddit_id, this.post.post_id).then(() => {
              this.events.publish('update:posts')
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
