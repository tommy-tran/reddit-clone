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
		this.getPosts();

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
				this.isLoggedIn = true;
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
		let createPostModal = this.modalCtrl.create(CreatePostPage, { subreddit: this.subreddit });
		console.log("isLoggedIn: " + this.isLoggedIn);
		if (this.isLoggedIn) {
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
		
		createPostModal.onDidDismiss(() => {
			this.getPosts();
		});
	}
}
