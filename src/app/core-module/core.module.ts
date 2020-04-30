import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ParallaxDirective} from './directive/parallax.directive';

@NgModule({
  declarations: [ParallaxDirective],
  imports: [CommonModule],
  exports: [ParallaxDirective],
})
export class CoreModule {}
