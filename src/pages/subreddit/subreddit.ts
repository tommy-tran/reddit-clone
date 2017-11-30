import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Navbar, Events, ModalController, PopoverController, AlertController } from 'ionic-angular';

import { AuthService } from '../../shared/auth.service';
import { CreatePostPage, LoginPage } from "../../shared/pages";
import { DatabaseService } from '../../shared/database.service';
import { DataSharingService } from '../../shared/data-sharing.service';
import { Post } from '../../models/post.model';
import { SortByPopover } from '../../components/sortBy/sortBy';
import { Subreddit } from '../../models/subreddit.model';
import { StorageService } from "../../shared/storage.service";
import { SettingsProvider } from '../../shared/theming.service';


@Component({
	selector: 'page-subreddit',
	templateUrl: 'subreddit.html',
})
export class SubredditPage implements OnInit {
	id: string;
	isEmpty: boolean;
	isLoggedIn: boolean;
	isSubscribed: boolean;
	@ViewChild(Navbar) navBar: Navbar;
	posts: Post[];
	selectedTheme: String;
	showBackgroundDiv: boolean;
	sortIcon: string;
	sortMethod: string;
	subreddit: Subreddit;
	times: string[];
	user_id: string;
	username: string;
	constructor(
		private databaseService: DatabaseService,
		private alertCtrl: AlertController,
		private dataSharing: DataSharingService,
		private authService: AuthService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public events: Events,
		public modalCtrl: ModalController,
		private popoverCtrl: PopoverController,
		private theming: SettingsProvider,
		private storageService: StorageService) {

		//initial sort by method and icon
		this.sortIcon = 'flame';
		this.sortMethod = 'hot';
		this.username = this.authService.getUsername();
		
		//theme to pass to create post
		this.events.subscribe('theme:retrieved', () => {
			console.log('ok');
			this.theming.getActiveTheme().subscribe(val => this.selectedTheme = val);
		});
		this.events.subscribe('update:posts', () => {
			this.authService.updateAuthState().then(() => {
				this.posts = []; // Clear posts
				this.getPosts(); // Get votable posts
				this.isLoggedIn = true;
			});
		});
		this.events.subscribe('update:posts', () => {
			this.posts = []; // Clear posts
			this.getPosts(); // Get votable posts
		});

	}
	/**
	 * get posts for the current subreddit
	 */
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
	/**
	 * initialize page state and content
	 */
	setUp() {
		this.authService.updateAuthState().then(() => {
			this.posts = []; // Clear posts
			this.getPosts(); // Get votable posts
			this.isLoggedIn = this.authService.isLoggedIn();
		});
		this.id = this.subreddit.subreddit_id;
		this.user_id = this.authService.getUID();
		this.posts = [];
		this.isSubscribed = this.storageService.isSubscribed(this.subreddit.subreddit_id);
		this.getPosts();
	}
	/**
	 * initialize current subreddit
	 */
	ngOnInit() {
		// When the back button is pressed
		this.navBar.backButtonClick = () => {
			this.events.publish('nav');
			this.navCtrl.pop();
		}

		this.isLoggedIn = this.authService.isLoggedIn();

		// Routing
		console.log(this.navParams.data);
		if (this.navParams.data['UID']) {
			this.subreddit = this.navParams.data;
			this.setUp();
		} else {
			let subredditName = this.navParams.data['name']
			if (subredditName) {
				// Check subreddit
				this.databaseService.checkGetSubreddit(subredditName).then((subreddit) => {
					if (subreddit) {
						this.subreddit = subreddit;
						this.setUp();
					} else {
						// Invalid subreddit
					}
				}).catch(() => {
					console.log("Subreddit not found");
				})
			} else {
				// 404 page or homepage?
			}
		}
	}
	/**
	 * add a new post to the current subreddit
	 */
	createPost() {
		let theme = this.theming.getThemeAsString()
		let createPostModal = this.modalCtrl.create(CreatePostPage, { subreddit: this.subreddit, theme: theme }, { cssClass: theme });
		if (this.isLoggedIn) {
			createPostModal.present();
		} else {
			const alert = this.alertCtrl.create({
			  title: "Not Logged In",
			  subTitle: "Please log in to upvote and downvote posts, as well as create your own subreddits, posts, and comments!",
			  buttons: [
				{
				  text: 'Log In/Sign Up',
				  role: 'login',
				  handler: data => {
					let theme = this.theming.getThemeAsString();
					let authModal = this.modalCtrl.create(LoginPage, { theme: theme }, { cssClass: theme });
					authModal.present();
					authModal.onWillDismiss((isLoggedIn) => {
						if (isLoggedIn) {
							this.isLoggedIn = isLoggedIn;
						}
					});
				  }
				},
				{
				  text: 'Dismiss'
				}
			  ]
			});
			alert.present();
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
			if (sortMethod != this.sortMethod && sortMethod) {
				this.sortMethod = sortMethod.sortMethod;
				this.sortIcon = sortMethod.icon;
				this.posts = this.dataSharing.sortBy(this.posts, this.sortMethod);
				//function to resort posts
			}
			this.showBackgroundDiv = false;
		})
	}
	/**
	 * subscribe a user to a subreddit
	 * @param user_id id of the user
	 * @param subreddit_name name of the subreddit to subscribe to
	 * @param subreddit_id id of the subreddit to subscribe to
	 */
	subscribe(user_id: string, subreddit_name: string, subreddit_id: string) {
		if (this.isLoggedIn){
			this.isSubscribed = !this.isSubscribed;
			this.databaseService.subscribeSubreddit(user_id, subreddit_name, subreddit_id).then(() => {
				this.storageService.getSubscribedSubreddits().then(subreddits => {
					if (!subreddits) {
						subreddits = [];
					}
					subreddits.push({ subreddit_id: subreddit_id, subreddit_name: subreddit_name });
					this.storageService.setSubscribedSubreddits(subreddits);
					console.log('subscribe success');
					//emit to home page to refresh subscribed
					this.navCtrl.viewDidLeave.subscribe(() => {
						this.events.publish('refresh:subscribed');
					});
				});
			}).catch(err => console.error(err));
		  } else {
			const alert = this.alertCtrl.create({
			  title: "Not Logged In",
			  subTitle: "Please log in or sign up to subscribe to subreddits!",
			  buttons: [
				{
				  text: 'Log In/Sign Up',
				  role: 'login',
				  handler: data => {
					let theme = this.theming.getThemeAsString();
					let authModal = this.modalCtrl.create(LoginPage, { theme: theme }, { cssClass: theme });
					authModal.present();
					authModal.onWillDismiss((isLoggedIn) => {
						if (isLoggedIn) {
							this.isLoggedIn = isLoggedIn;
						}
					});
				  }
				},
				{
				  text: 'Dismiss'          }
			  ]
			});
			alert.present();
		  }
	}
	/**
	 * unsubscribe a user from a subreddit
	 * @param user_id id of the user
	 * @param subreddit_id id of the subreddit to unsubscribe from
	 */
	unsubscribe(user_id: string, subreddit_id: string) {
		this.isSubscribed = !this.isSubscribed;
		this.databaseService.unsubscribeSubreddit(user_id, subreddit_id).then(() => {
			this.storageService.getSubscribedSubreddits().then(subreddits => {
				for (let i = 0; i < subreddits.length; i++) {
					if (subreddits[i].subreddit_id == subreddit_id) {
						subreddits.splice(i, 1);
						break;
					}
				}
				this.storageService.setSubscribedSubreddits(subreddits);
				console.log('unsubscribe success');
				//emit to home page to refresh subscribed
				this.navCtrl.viewWillLeave.subscribe(() => {
					this.events.publish('refresh:subscribed');
				});
			});
		}).catch(err => console.error(err));
	}
}
