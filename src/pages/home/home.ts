import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { LoginPage, SubredditPage, CreateSubredditPage } from "../../shared/pages";
import { Subreddit } from '../../models/subreddit.model';
import { Post } from '../../models/post.model';
import { DataSharingService } from '../../shared/data-sharing.service';
import { SortByPopover } from '../../components/sortBy/sortBy';

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
    private dataSharing: DataSharingService,
    private events: Events,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private storage: Storage) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.storage.get("userHasAccount").then(val => {
      this.userHasAccount = val;
    });
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
    this.events.subscribe('nav', () => {
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
    this.sort("hot");
  }

  getAllSubreddits() {
    // Clean subreddits
    this.subreddits = [];
    // Get subreddits
    this.databaseService.getSubreddits().then((subreddits) => {
      this.subreddits = [];
      for (var key in subreddits) {
        this.subreddits.push(subreddits[key]);
      }
    }).catch(err => console.error(err));
  }

  getAllPosts() {
    // Clean posts
    this.posts = [];
    // Get posts
    this.databaseService.getAllPosts().then((subreddits) => {
      let subredditList = [];
      for (var key in subreddits) {
        subredditList.push(subreddits[key]);
      }
      subredditList.forEach((subreddit) => {
        for (var subredditKey in subreddit) {
          this.posts.push(subreddit[subredditKey]);
        }
      });
      //initially sort the posts by most popular
      this.posts = this.dataSharing.sortBy(this.posts, 'hot');
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
    authModal.onWillDismiss((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.userHasAccount = true;
        console.log("loggedin: " + this.isLoggedIn);
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
      if (sortMethod != this.sortMethod && sortMethod) {
        this.sortMethod = sortMethod.sortMethod;
        this.sortIcon = sortMethod.icon;
        
        this.sort(this.sortMethod);
      }
      this.showBackgroundDiv = false;
    })
  }
  /**
   * sort the posts
   * @param sortMethod method to sort posts by
   */
  sort(sortMethod: string) {
    this.posts = this.dataSharing.sortBy(this.posts, sortMethod);
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
      console.log(subreddit);
      if (subreddit) {
        this.navCtrl.push(SubredditPage, subreddit);
      }
    });
  }

  /**
   * create a new subreddit
   */
  createSubreddit() {
    let createSubredditModal = this.modalCtrl.create(CreateSubredditPage, {});
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
  }
}