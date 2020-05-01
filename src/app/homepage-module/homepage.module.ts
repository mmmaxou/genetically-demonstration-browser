import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NbButtonModule, NbIconModule, NbInputModule} from '@nebular/theme';
import {HighlightModule} from 'ngx-highlightjs';
import {UiModule} from '../ui-module/ui.module';
import {HomeComponent} from './home/home.component';
import {HomepageRoutingModule} from './homepage-routing.module';
import {SentenceExampleComponent} from './sentence-example/sentence-example.component';
import {CoreModule} from '../core-module/core.module';

@NgModule({
  declarations: [HomeComponent, SentenceExampleComponent],
  imports: [
    // Standard
    CommonModule,
    FormsModule,

    // My modules
    HomepageRoutingModule,
    CoreModule,
    UiModule,

    // Nebular
    NbInputModule,
    NbButtonModule,
    NbIconModule,

    // Ngx Highlight
    HighlightModule,
  ],
})
export class HomepageModule {}
