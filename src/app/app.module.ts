import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {HighlightModule} from 'ngx-highlightjs';
import {AppComponent} from './app-component/app.component';
import {routes} from './app-routes.module';
import {CoreModule} from './core-module/core.module';
import {HomepageModule} from './homepage-module/homepage.module';
import {UiModule} from './ui-module/ui.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Standard
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, {useHash: true}), // if this is your app.module

    // My modules
    UiModule,
    HomepageModule,
    CoreModule,

    // Highlight.js
    HighlightModule,

    /// Nebular
    NbThemeModule.forRoot(),
    NbEvaIconsModule,
    NbLayoutModule,
  ],
  providers: [
    /*
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages(),
      },
    },
    */
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
