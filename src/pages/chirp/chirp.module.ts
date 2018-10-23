import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChirpPage } from './chirp';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChirpPage,
  ],
  imports: [
    IonicPageModule.forChild(ChirpPage),
    TranslateModule.forChild()
  ],
  exports: [
    ChirpPage
  ]
})
export class ChirpPageModule {}
