import {Pipe, PipeTransform} from '@angular/core';
import {displayFunction} from 'src/functions/DisplayFunction';

@Pipe({
  name: 'functionName',
})
export class FunctionNamePipe implements PipeTransform {
  // tslint:disable-next-line: ban-types
  transform(value: Function, name: string): string {
    return displayFunction(value, name);
  }
}
