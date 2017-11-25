import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { DataSharingService } from '../../shared/data-sharing.service';
import { LoginPage, CreateSubredditPage, ProfilePage } from "../../shared/pages";
import { Post } from '../../models/post.model';
import { SettingsProvider } from "../../shared/theming.service";
import { SortByPopover } from '../../components/sortBy/sortBy';
import { Subreddit } from '../../models/subreddit.model';
import { StorageService } from '../../shared/storage.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showSubscribedSubreddits: boolean;
  menuIconColor: string;
  posts: Post[];
  isCardLayout: boolean;
  isLoggedIn: boolean;
  isMobile: boolean;
  menuColor: string;
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
  selectedTheme: String;
  subscribedSubreddits: any;
  user_id: string;
  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    private dataSharing: DataSharingService,
    private events: Events,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private theming: SettingsProvider,
    private storage: Storage,
    private storageService: StorageService) {
    // Update authservice variables when still logged in
    this.authService.updateAuthState().then(() => {
      this.setUp();
      this.isLoggedIn = this.authService.isLoggedIn();
      this.user_id = this.authService.getUID();
    });
    //set up theme, event emitted in theme service
    this.events.subscribe('theme:retrieved', () => {
      this.theming.getActiveTheme().subscribe(val => {
        if (val) {
          this.selectedTheme = val;
          switch (val.valueOf()) {
            case 'light-theme':
              this.menuColor = 'light';
              this.menuIconColor = 'secondary';
              break;
            case 'dark-theme':
              this.menuColor = 'dark';
              this.menuIconColor = 'primary';
              break;
          }
        }
        else {
          this.selectedTheme = 'light-theme';
          this.menuColor = 'light';
          this.menuIconColor = 'secondary';
        }
      });
    });
    //fires when the user id is set in authService
    this.events.subscribe('user:loggedin&set', () => {
      this.getSubscribed();
    })
    this.menuIconColor = 'secondary';

    this.isLoggedIn = this.authService.isLoggedIn();
    this.storage.get("userHasAccount").then(val => {
      this.userHasAccount = val;
    });
    this.user_id = this.authService.getUID();
    this.showSubscribedSubreddits = true;


    this.posts = [];

    //initial sort by method and icon
    this.sortIcon = 'flame';
    this.sortMethod = 'hot';
    //searchbar results
    // this.databaseService.getSubreddits().then(subreddits => {
    //   this.subreddits = subreddits;
    //   this.subredditDisplay = [];
    // });

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

    //refresh subscribed when user subscribes/unsubscribes
    this.events.subscribe('refresh:subscribed', () => {
      this.storageService.getSubscribedSubreddits().then(subscribed => {
        console.log('refresh');
        this.subscribedSubreddits = subscribed;
      });
    });
  }
  /** 
   * Set up environment
   */
  setUp() {
    this.setUsername();
    this.getAllSubreddits();
    this.getAllPosts();
    this.isMobile = this.dataSharing.getIsMobile();
    this.sort("hot");
  }
  /**
   * get user's subscribed subreddits from storage or from database
   */
  getSubscribed() {
    //initialize subscribed subreddits
    let subscribedSubreddits = this.storageService.getInitSubreddits();
    if (!subscribedSubreddits || subscribedSubreddits.length == 0) {
      this.databaseService.getSubscribedSubreddits(this.authService.getUID()).then(subreddits => {
        console.log(subreddits);
        this.subscribedSubreddits = subreddits;
        let subscribed = [];
        for (var key in subreddits) {
          subscribed.push(subreddits[key]);
        }
        this.subscribedSubreddits = subscribed;
        this.storageService.setSubscribedSubreddits(subscribed);
      });
    }
    else {
      this.subscribedSubreddits = subscribedSubreddits;
    }
  }
  /**
   * get a list of all subreddits
   */
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
  /**
   * get all posts
   */
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
  /**
   * set the user's username
   */
  setUsername() {
    this.username = this.authService.getUsername();
  }

  /**
   * Log out user
   */
  logout() {
    this.authService.logout().then(() => {
      this.username = "";
      this.isLoggedIn = false;
      this.closeAllOverlays();
      this.subscribedSubreddits = [];
      this.authService.updateAuthState().then(() => {
        this.posts = [];
        this.getAllPosts();

      });
    });
  }
  /**
   * open the login/signup page
   */
  openAuth() {
    let param = { theme: this.selectedTheme };
    let authModal = this.modalCtrl.create(LoginPage, param, {
      cssClass: this.selectedTheme.valueOf()
    });
    authModal.present();
    authModal.onWillDismiss((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.userHasAccount = true;
        this.getSubscribed();
        this.closeAllOverlays();
        console.log("loggedin: " + this.isLoggedIn);
      }
    });
  }

  /**
   * open the user profile page
   */
  openProfile() {
    if (this.isLoggedIn) {
      let param = { userHasAccount: this.userHasAccount, username: this.username, theme: this.selectedTheme };
      let profModal = this.modalCtrl.create(ProfilePage, param, {
        cssClass: this.selectedTheme.valueOf()
      });
      profModal.present();
      // this.navCtrl.push('profile', param);
    }
    else {
      this.openAuth();
    }
  }
  /**
   * display user info to the console
   */
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
    this.showSearchbar = false;
    this.showMenu = !this.showMenu;
  }
  /**
   * toggle the display of the searchbar
   */
  toggleSearchbar() {
    this.showMenu = false;
    this.showSearchbar = !this.showSearchbar;
  }
  /*
  toggleNewPostBox() {
    if (this.userHasAccount && this.isLoggedIn) {
      this.showNewPostBox = !this.showNewPostBox;
    }
    else {
      //prompt user to log in
      this.openAuth();
    }
  }*/
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
    if (this.selectedTheme === 'dark-theme') {
      this.theming.setActiveTheme('light-theme');
      this.selectedTheme = 'light-theme';
      this.menuColor = 'light';
      this.menuIconColor = 'secondary';
    } else {
      this.theming.setActiveTheme('dark-theme');
      this.selectedTheme = 'dark-theme';
      this.menuColor = 'dark';
      this.menuIconColor = 'primary';
    }
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
      this.showSubscribedSubreddits = false;
      this.subredditDisplay = this.subreddits.filter((subreddit) => {
        return subreddit.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
      });
    }
  }
  /**
   * 
   * @param event click event fired by user's input
   */
  onCancel(event) {
    this.showSubscribedSubreddits = true;
  }
  /**
   * navigate to a subreddit's page
   * @param subreddit the subreddit to nav to
   */
  goToSubreddit(subreddit_id: string) {
    this.databaseService.getSubreddit(subreddit_id).then((subreddit) => {
      if (subreddit) {
        this.navCtrl.push('subreddit', subreddit);
      }
    });
  }

  /**
   * create a new subreddit
   */
  createSubreddit() {
    let createSubredditModal = this.modalCtrl.create(CreateSubredditPage, { theme: this.selectedTheme.valueOf() }, {
      cssClass: this.selectedTheme.valueOf()
    });
    console.log("loggedIn: " + this.isLoggedIn);
    if (this.isLoggedIn) {
      createSubredditModal.present();
    } else {
      let authModal = this.modalCtrl.create(LoginPage, { theme: this.selectedTheme }, { cssClass: this.selectedTheme.valueOf() });
      authModal.present();
      authModal.onWillDismiss((isLoggedIn) => {
        if (isLoggedIn) {
          this.isLoggedIn = isLoggedIn;
          this.getSubscribed();
        }
      });
    }
  }
}