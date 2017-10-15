import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, Events, ViewController, NavParams } from 'ionic-angular';

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { LoginPage, SubredditPage, CreateSubredditPage } from "../../shared/pages";
import { Subreddit } from '../../models/subreddit.model';
import { Post } from '../../models/post.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Post[];
  isCardLayout: boolean;
  isLoggedIn: boolean;
  menuOptions: { icon: string, title: string, action: string }[];
  showBackgroundDiv: boolean;
  showMenu: boolean;
  sortMethod: string;
  showNewPostBox: boolean;
  showSearchbar: boolean;
  sortIcon: string;
  subreddits: Subreddit[];
  subredditDisplay: Subreddit[];
  username: string;
  userHasAccount: boolean;
  selectedSubreddit: string;
  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private events: Events,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private popoverCtrl: PopoverController) {
    this.isLoggedIn = this.authService.isLoggedIn();
 
    this.posts = [];
    
    //initial sort by method and icon
    this.sortIcon = 'flame';
    this.sortMethod = 'hot';
    //searchbar results
    // this.databaseService.getSubreddits().then(subreddits => {
    //   this.subreddits = subreddits;
    //   this.subredditDisplay = [];
    // });
    //menu display
    this.menuOptions = [
      { icon: 'contact', title: 'Log In / Sign Up', action: 'openAuth' },
      { icon: 'menu', title: 'Card View', action: 'toggleLayout' },
      { icon: 'contrast', title: 'Night Theme', action: 'toggleTheme' }
    ];
    this.isCardLayout = false;
    this.closeAllOverlays();
    
    // When user logs in, update authservice variables
    this.events.subscribe('user:loggedin', () => {
      this.authService.updateAuthState().then(() => {
        this.setUsername();
        this.posts = []; // Clear posts
        this.getAllPosts(); // Get votable posts
      });
    });
    // When user navigates from subreddits, refresh
    this.events.subscribe('nav:subreddit', () => {
      this.getAllPosts();
    });

    // Update authservice variables when still logged in
    this.authService.updateAuthState().then(() => {
      this.setUp();
      this.isLoggedIn = this.authService.isLoggedIn();      
    });
  }
  /**
   * used for dynamic 'click' events for menuOptions and ngFor in template
   */
  get self() { return this; }

  /** 
   * Set up environment
   */
  setUp() {
    this.setUsername();
    this.getAllSubreddits();
    this.getAllPosts();    
  }

  getAllSubreddits() {
    // Clean subreddits
    this.subreddits = [];
    // Get subreddits
    this.databaseService.getSubreddits().then((subreddits) => {
      console.log(Object.values(subreddits));
      this.subreddits = Object.values(subreddits);
    }).catch(err => console.error(err));
  }

  getAllPosts() {
    // Clean posts
    this.posts = [];
    // Get posts
    this.databaseService.getAllPosts().then((subreddits) => {
      let subredditList = Object.values(subreddits);
      subredditList.forEach((post) => {
        this.posts = this.posts.concat(Object.values(post));
      });
    }).catch(err => console.error(err));
  }

  setUsername() {
    this.username = this.authService.getUsername();
  }

  /**
   * Log out user
   */
  logout() {
    this.authService.logout().then(() => {
      this.username = "";
      this.authService.updateAuthState().then(() => {
        this.posts = [];
        this.getAllPosts();
      })
    });
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

  showUserInfo() {
    console.log("Username: " + this.authService.getUsername());
    console.log("UID: " + this.authService.getUID());
    console.log("Email: " + this.authService.getEmail());
  }

  /**
   * Get posts from specified subreddit
   */
  // getPosts() {
  //   this.databaseService.getSubredditPosts("subredditID_1").then((posts) => {
  //     this.posts = this.posts.concat(Object.values(posts));
  //   }).catch(err => console.error(err));
  // }

  /**
   * toggle the display of the menu
   */
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  /**
   * toggle the display of the searchbar
   */
  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  toggleNewPostBox() {
    if (this.userHasAccount && this.isLoggedIn) {
      this.showNewPostBox = !this.showNewPostBox;
    }
    else {
      //prompt user to log in
      this.openAuth();
    }
  }
  /**
   * close any overlaying components
   */
  closeAllOverlays() {
    this.showMenu = false;
    this.showNewPostBox = false;
    this.showSearchbar = false;
  }
  /**
   * switch between large images and small images
   */
  toggleLayout() {
    this.isCardLayout = !this.isCardLayout;
  }
  /**
   * switch between dark and light themes
   */
  toggleTheme() {
    //look into theming
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
        //function to resort posts
      }
      this.showBackgroundDiv = false;
    })
  }
  /**
   * reinitialize the search results on keyup
   */
  initializeSearch() {
    this.subredditDisplay = [];
  }
  /**
   * filter the list of subreddits and display those that match the user's input
   * @param event keyup event fired by the user's input
   */
  onInput(event) {
    this.initializeSearch();
    let val = event.target.value;
    if (val && val.trim() != '') {
      this.subredditDisplay = this.subreddits.filter((subreddit) => {
        return subreddit.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
      });
    }
    console.log(this.subredditDisplay);
  }
  /**
   * navigate to a subreddit's page
   * @param subreddit the subreddit to nav to
   */
  goToSubreddit(subreddit_id: string) {
    this.databaseService.getSubreddit(subreddit_id).then((subreddit) => {
      if (subreddit) {
        this.navCtrl.push(SubredditPage, subreddit);
      }
    });
  }

  /**
   * create a new subreddit
   */
  createSubreddit() {
  
		let createSubredditModal = this.modalCtrl.create(CreateSubredditPage, { });
    console.log("loggedIn: " + this.isLoggedIn);
		if (this.isLoggedIn) {
			createSubredditModal.present();
		} else {
			let authModal = this.modalCtrl.create(LoginPage);
			authModal.present();
			authModal.onWillDismiss((isLoggedIn) => {
				if (isLoggedIn) {
					this.isLoggedIn = isLoggedIn;
				}
			});
		}
		/*
		createPostModal.onDidDismiss(() => {
			this.getPosts();
		}); */
	}
}
@Component({
  template: `
  <ion-content padding>
    <p>Sort Posts By:</p>
    <div style="width: 100%; border-bottom: 1px solid lightgrey"></div>
    <ion-list>
      <button (click)="selectSortMethod('hot')" ion-item no-lines>
        <ion-icon *ngIf="sortMethod == 'hot'" color="someblue" name="flame"></ion-icon>
        <ion-icon *ngIf="!(sortMethod == 'hot')" color="prettygray" name="flame"></ion-icon>
        Hot
      </button>
      <button (click)="selectSortMethod('new')" ion-item no-lines>
        <ion-icon *ngIf="sortMethod == 'new'" color="someblue" name="star"></ion-icon>
        <ion-icon *ngIf="!(sortMethod == 'new')" color="prettygray" name="star"></ion-icon>
        New
      </button>
      <button (click)="selectSortMethod('top')" ion-item no-lines>
        <ion-icon *ngIf="sortMethod == 'top'" color="someblue" name="podium"></ion-icon>
        <ion-icon *ngIf="!(sortMethod == 'top')" color="prettygray" name="podium"></ion-icon>
        Top
      </button>
    </ion-list>
  </ion-content>
  `
})
export class SortByPopover {
  sortMethod: string;
  constructor(private events: Events, private viewCtrl: ViewController, private navParams: NavParams) {
    if (this.navParams.data.sortMethod) {
      this.sortMethod = navParams.data.sortMethod;
    }
    else {
      this.sortMethod = 'hot';
    }
  }
  /**
   * sort posts by a sort method
   * @param sortMethod method to sort by
   */
  selectSortMethod(sortMethod: 'hot' | 'new' | 'top') {
    let icons = { hot: 'flame', new: 'star', top: 'podium' }
    this.sortMethod = sortMethod;
    this.viewCtrl.dismiss({ sortMethod: sortMethod, icon: icons[sortMethod] });
  }
}
