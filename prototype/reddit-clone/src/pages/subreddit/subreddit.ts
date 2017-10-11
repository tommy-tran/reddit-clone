import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Events, ModalController } from 'ionic-angular';
import { Subreddit } from '../../models/subreddit.model';
import { CreatePostPage, LoginPage } from "../../shared/pages";
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';
import { AuthService } from '../../shared/auth.service';

@IonicPage()
@Component({
	selector: 'page-subreddit',
	templateUrl: 'subreddit.html',
})
export class SubredditPage implements OnInit {
	@ViewChild(Navbar) navBar: Navbar;
	id: string;
	subreddit: Subreddit;
	posts: Post[];
	times: string[];
	isLoggedIn: boolean;

	// TODO: Description, possibly creator privileges, goToPost, voting

	constructor(
		private databaseService: DatabaseService,
		private authService: AuthService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		public modalCtrl: ModalController) {
		this.isLoggedIn = this.authService.isLoggedIn();
		this.subreddit = this.navParams.data;
		this.id = this.subreddit.subreddit_id;
		this.posts = [];
		this.times = [];
		this.getPosts();

		// https://firebase.google.com/docs/reference/js/firebase.database.ServerValue for working with timestamps
		// let currentDate = new Date();
		// posts.forEach(post => {
		//   let postDate = new Date(post.timestamp);
		//   let timeDiff = this.calculateTimeDifference(postDate, currentDate)
		//   this.times.push(timeDiff);
		// });

		this.events.subscribe('user:loggedin', () => {
			this.authService.updateAuthState().then(() => {
				this.posts = []; // Clear posts
				this.getPosts(); // Get votable posts
			});
		});

		this.events.subscribe('user:loggedin', () => {
			this.authService.updateAuthState().then(() => {
				this.posts = []; // Clear posts
				this.getPosts(); // Get votable posts
			});
		});

	}

	getPosts() {
		this.databaseService.getSubredditPosts(this.id).then(posts => {
			this.posts = Object.values(posts);
		});
	}

	ngOnInit() {
		// When the back button is pressed
		this.navBar.backButtonClick = () => {
			this.events.publish('nav:subreddit');
			this.navCtrl.pop();
		}
	}

	createPost() {
		if (this.isLoggedIn) {
			let createPostModal = this.modalCtrl.create(CreatePostPage, { subreddit: this.subreddit });
			createPostModal.present();
		} else {
			let authModal = this.modalCtrl.create(LoginPage);
			authModal.present();
			authModal.onWillDismiss((isLoggedIn) => {
				if (isLoggedIn) {
					this.isLoggedIn = isLoggedIn;
				}
			});
		}
		// onWillDismiss()
	}

	calculateTimeDifference(date1, date2) {
		var difference = date1.getTime() - date2.getTime();

		var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
		difference -= daysDifference * 1000 * 60 * 60 * 24

		var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
		difference -= hoursDifference * 1000 * 60 * 60

		var minutesDifference = Math.floor(difference / 1000 / 60);
		difference -= minutesDifference * 1000 * 60

		var secondsDifference = Math.floor(difference / 1000);

		if (daysDifference >= 1) {
			return daysDifference + ' d'
		}
		else if (hoursDifference >= 1 && hoursDifference < 24) {
			return hoursDifference + ' hr'
		}
		else if (minutesDifference < 60 && minutesDifference >= 1) {
			return minutesDifference + ' m';
		}
		else {
			return secondsDifference + ' s'
		}
	}
}
