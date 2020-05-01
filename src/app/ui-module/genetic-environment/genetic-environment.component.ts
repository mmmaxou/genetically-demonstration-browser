import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {GeneticAlgorithm, Population} from 'genetically';

type GeneticEnvironmentStatus = 'Running' | 'Stopped';

@Component({
  selector: 'app-genetic-environment',
  templateUrl: './genetic-environment.component.html',
  styleUrls: ['./genetic-environment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneticEnvironmentComponent implements OnInit {
  @Input() geneticAlgorithm: GeneticAlgorithm<any>;
  @Output() stop = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() population = new EventEmitter<Population>();

  public status: GeneticEnvironmentStatus = 'Stopped';

  constructor() {}

  ngOnInit() {}

  get isRunning(): boolean {
    return this.status === 'Running';
  }

  runEnv(): void {
    this.status = 'Running';
    this.start.emit();
    this.geneticAlgorithm.run().then(() => {
      this.stopEnv();
    });
  }

  stopEnv(): void {
    this.status = 'Stopped';
    this.stop.emit();
    console.log(this.geneticAlgorithm);
  }
}
