import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { CommentComponent } from './comment/comment';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';


@NgModule({
	declarations: [PostComponent, CommentComponent],
	imports: [IonicModule, CommonModule],
	exports: [PostComponent, CommentComponent]
})
export class ComponentsModule {}
