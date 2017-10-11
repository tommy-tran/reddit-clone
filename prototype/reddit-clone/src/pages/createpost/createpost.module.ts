import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePostPage } from './createpost';

@NgModule({
  declarations: [
    CreatePostPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePostPage),
  ],
})
export class CreatePostPageModule {}
