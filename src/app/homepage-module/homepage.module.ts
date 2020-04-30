import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomepageRoutingModule} from './homepage-routing.module';
import {HomeComponent} from './home/home.component';
import {SentenceExampleComponent} from './sentence-example/sentence-example.component';
import {UiModule} from '../ui-module/ui.module';
import {HighlightModule} from 'ngx-highlightjs';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, SentenceExampleComponent],
  imports: [
    // Standard
    CommonModule,
    FormsModule,

    // My modules
    HomepageRoutingModule,
    UiModule,

    // Ngx Highlight
    HighlightModule,
  ],
})
export class HomepageModule {}
