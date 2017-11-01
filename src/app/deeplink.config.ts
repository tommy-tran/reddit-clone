import { DeepLinkConfig } from "ionic-angular";
import { SubredditPage, HomePage, CommentsPage,  } from "../shared/pages";

export const deepLinkConfig: DeepLinkConfig = {
    links: [
      { component: HomePage, name: "home", segment: ""},
    //   { component: CommentsPage, name: "post", segment: "event/:subredditName/:", defaultHistory: [HomePage] }
    ]
  };