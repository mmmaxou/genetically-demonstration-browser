import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ParallaxDirective} from './directive/parallax.directive';
import { FunctionNamePipe } from './pipes/function-name.pipe';

@NgModule({
  declarations: [ParallaxDirective, FunctionNamePipe],
  imports: [CommonModule],
  exports: [ParallaxDirective, FunctionNamePipe],
})
export class CoreModule {}
