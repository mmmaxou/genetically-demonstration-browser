import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NbButtonModule, NbIconModule} from '@nebular/theme';
import {GeneticEnvironmentComponent} from './genetic-environment/genetic-environment.component';

@NgModule({
  declarations: [GeneticEnvironmentComponent],
  imports: [CommonModule, NbIconModule, NbButtonModule],
  exports: [GeneticEnvironmentComponent, NbIconModule, NbButtonModule],
})
export class UiModule {}
