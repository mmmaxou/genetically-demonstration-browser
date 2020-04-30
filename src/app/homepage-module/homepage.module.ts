import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomepageRoutingModule} from './homepage-routing.module';
import {HomeComponent} from './home/home.component';
import {SentenceExampleComponent} from './sentence-example/sentence-example.component';
import {UiModule} from '../ui-module/ui.module';

@NgModule({
  declarations: [HomeComponent, SentenceExampleComponent],
  imports: [CommonModule, HomepageRoutingModule, UiModule],
})
export class HomepageModule {}
