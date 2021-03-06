import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbProgressBarModule,
} from '@nebular/theme';
import {GeneticEnvironmentComponent} from './genetic-environment/genetic-environment.component';

import {NgxEchartsModule} from 'ngx-echarts';

import {Ng5SliderModule} from 'ng5-slider';

@NgModule({
  declarations: [GeneticEnvironmentComponent],
  imports: [
    CommonModule,

    Ng5SliderModule,

    NgxEchartsModule,

    NbIconModule,
    NbButtonModule,
    NbProgressBarModule,
    NbInputModule,
  ],
  exports: [
    CommonModule,

    GeneticEnvironmentComponent,

    Ng5SliderModule,

    NgxEchartsModule,

    NbIconModule,
    NbButtonModule,
    NbProgressBarModule,
    NbInputModule,
  ],
})
export class UiModule {}
