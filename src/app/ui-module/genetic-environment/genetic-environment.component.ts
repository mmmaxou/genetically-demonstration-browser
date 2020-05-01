// tslint:disable: variable-name
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {GeneticAlgorithm, Population} from 'genetically';
import {Options} from 'ng5-slider';
import {Unsubscribe} from 'genetically/build/main/lib/Helpers/NanoEvents';

type GeneticEnvironmentStatus = 'Running' | 'Stopped' | 'Paused';

@Component({
  selector: 'app-genetic-environment',
  templateUrl: './genetic-environment.component.html',
  styleUrls: ['./genetic-environment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneticEnvironmentComponent implements OnInit, OnDestroy {
  popSizeValue: number;
  iterationsValue: number;
  delayValue = 0;
  iteration = 0;
  fitnessMax = 0;
  fitnessMean = 0;
  fitnessSum = 0;
  public status: GeneticEnvironmentStatus = 'Stopped';
  private _geneticAlgorithm: GeneticAlgorithm<any>;
  private _unsub: Unsubscribe;

  @Output() stop = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() population = new EventEmitter<Population>();

  @Input() useInfos = true;
  @Input() useOptions = true;
  @Input() useExcerpt = true;
  @Input()
  set geneticAlgorithm(g: GeneticAlgorithm<any>) {
    this._geneticAlgorithm = g;
    this.popSizeValue = g.configuration.population.popsize;
    this.iterationsValue = g.configuration.iterations;
    this.changeDetectorRef.markForCheck();

    this._unsub = this.geneticAlgorithm.onPeek((population, i) => {
      this.iteration = i;
      this.fitnessMax = population.fittest.fitnessScore;
      this.fitnessMean = population.meanFitness;
      this.fitnessSum = population.sumFitness;

      this.changeDetectorRef.markForCheck();
    });
  }
  get geneticAlgorithm() {
    return this._geneticAlgorithm;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsub?.();
  }

  get progression(): number {
    return Math.max(
      Math.min(
        ((+this.iteration || 0) / (+this.iterationsValue || 1)) * 100,
        100
      ),
      0
    );
  }

  get isRunning(): boolean {
    return this.status === 'Running';
  }

  get isStopped(): boolean {
    return this.status === 'Stopped';
  }

  get isPaused(): boolean {
    return this.status === 'Paused';
  }

  get shallDisplayControl(): boolean {
    return this.useOptions && !!this.geneticAlgorithm && this.isStopped;
  }

  get shallDisplayExcerpt(): boolean {
    return this.useExcerpt && !!this.geneticAlgorithm;
  }

  get shallDisplayInfo(): boolean {
    return this.useInfos && !!this.geneticAlgorithm;
  }

  get excerptEncoded(): any {
    const pop = this.geneticAlgorithm.lastPopulation.population;
    const rng = Math.ceil(Math.random() * pop.length - 1);
    const excerpt = pop[rng];
    return excerpt.chain;
  }

  get excerptDecoded(): any {
    const pop = this.geneticAlgorithm.lastPopulation.population;
    const rng = Math.ceil(Math.random() * pop.length - 1);
    const excerpt = pop[rng];
    return this.geneticAlgorithm.decode(excerpt.chain);
  }

  get popSizeOptions(): Options {
    return {
      floor: 1,
      ceil: 200,
      showSelectionBar: true,
      selectionBarGradient: {
        from: '#de8387',
        to: '#3275e7',
      },
    };
  }

  popSizeChange({value}) {
    this.geneticAlgorithm.changeConfiguration({
      population: {
        ...this.geneticAlgorithm.configuration.population,
        popsize: value || 50,
      },
    });
  }

  get iterationsOptions(): Options {
    return {
      floor: 1,
      ceil: 5000,
      logScale: true,
      showSelectionBar: true,
      selectionBarGradient: {
        from: '#de8387',
        to: '#3275e7',
      },
    };
  }

  iterationsChange({value}) {
    this.geneticAlgorithm.changeConfiguration({
      iterations: value,
    });
  }

  get delayOptions(): Options {
    return {
      floor: 1,
      ceil: 1000,
      showSelectionBar: true,
      selectionBarGradient: {
        from: '#de8387',
        to: '#3275e7',
      },
      translate: (value: number): string => {
        return value + ' ms';
      },
    };
  }

  delayChange({value}) {
    console.log('delay change', value);
    this.geneticAlgorithm.changeConfiguration({
      waitBetweenIterations: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, value);
        });
      },
    });
  }

  runEnv(): void {
    if (this.status === 'Paused') {
      this.geneticAlgorithm.resume();
      this.status = 'Running';
    } else {
      this.status = 'Running';
      this.start.emit();
      this.geneticAlgorithm.run().then(() => {
        this.stop.emit();
      });
    }
  }

  pauseEnv(): void {
    this.status = 'Paused';
    this.geneticAlgorithm.pause();
  }
}
