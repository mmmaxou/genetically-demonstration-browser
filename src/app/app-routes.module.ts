import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./homepage-module/homepage.module').then((m) => m.HomepageModule),
  },
];
