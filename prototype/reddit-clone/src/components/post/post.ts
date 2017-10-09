import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {
  // creator: string;
  // media: string;
  // timestamp: number;
  // title: string;
  // upvotes: number;
  // message: string;
  // subreddit: string;

  @Input() post: Post;

  constructor() {
  }

}
