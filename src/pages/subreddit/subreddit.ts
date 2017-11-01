import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Events, ModalController, PopoverController } from 'ionic-angular';
import { Subreddit } from '../../models/subreddit.model';
import { CreatePostPage, LoginPage } from "../../shared/pages";
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';
import { AuthService } from '../../shared/auth.service';
import { SortByPopover } from '../../components/sortBy/sortBy';
import { DataSharingService } from '../../shared/data-sharing.service';

@IonicPage({
	name: 'subreddit',
	segment: 'r/:name',
	defaultHistory: ['homepage']
})
@Component({
	selector: 'page-subreddit',
	templateUrl: 'subreddit.html',
})
export class SubredditPage implements OnInit {
	sortIcon: string;
	sortMethod: string;
	showBackgroundDiv: boolean;
	@ViewChild(Navbar) navBar: Navbar;
	id: string;
	subreddit: Subreddit;
	posts: Post[];
	times: string[];
	isLoggedIn: boolean;
	isEmpty: boolean;

	// TODO: Description, possibly creator privileges, goToPost, voting

	constructor(
		private databaseService: DatabaseService,    
		private dataSharing: DataSharingService,
		private authService: AuthService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		public modalCtrl: ModalController,
		private popoverCtrl: PopoverController) {
		//initial sort by method and icon
		this.sortIcon = 'flame';
		this.sortMethod = 'hot';
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

	test() {
		console.log(this.navParams.data['name']);
	}

	getPosts() {
		this.databaseService.getSubredditPosts(this.id).then(posts => {
			if (posts) {
				this.isEmpty = false;
				this.posts = [];
				for (var key in posts) {
					this.posts.push(posts[key]);
				}
				this.posts = this.dataSharing.sortBy(this.posts, this.sortMethod);
			} else {
				this.isEmpty = true;
			}
		});
	}

	ngOnInit() {
		// When the back button is pressed
		this.navBar.backButtonClick = () => {
			this.events.publish('nav');
			this.navCtrl.pop();
		}

		// Routing
		let subredditName = this.navParams.data['name']
		if (subredditName) {
			this.isLoggedIn = this.authService.isLoggedIn();
			// Check subreddit
			this.databaseService.checkSubreddit(subredditName).then((subreddit) => {
				if (subreddit) {
					this.subreddit = subreddit;
					this.id = this.subreddit.subreddit_id;
					this.posts = [];
					this.getPosts();
				} else {
					// Invalid subreddit
				}

			})
		} else {
			// 404 page or homepage?
		}
	
	}

	createPost() {
		let createPostModal = this.modalCtrl.create(CreatePostPage, { subreddit: this.subreddit });
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
	/**
  * show a popover with options to sort posts by
  * @param ev tells the popover where to display on the page
  */
	showSortByPopover(ev) {
		this.showBackgroundDiv = true;
		let popover = this.popoverCtrl.create(SortByPopover, { sortMethod: this.sortMethod });
		popover.present({ ev: ev });
		popover.onWillDismiss(sortMethod => {
			if (sortMethod != this.sortMethod) {
				this.sortMethod = sortMethod.sortMethod;
				this.sortIcon = sortMethod.icon;
				this.posts = this.dataSharing.sortBy(this.posts, this.sortMethod);
				//function to resort posts
			}
			this.showBackgroundDiv = false;
		})
	}
}
