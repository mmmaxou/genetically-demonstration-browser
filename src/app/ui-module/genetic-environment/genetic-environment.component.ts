// tslint:disable: variable-name
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {GeneticAlgorithm, Population} from 'genetically';
import {Unsubscribe} from 'genetically/build/main/lib/Helpers/NanoEvents';
import {EChartOption} from 'echarts';
import {Options} from 'ng5-slider';

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
  iterationArr: any[] = [];
  fitnessMaxArr: {name: string; value: number}[] = [];
  fitnessMeanArr: {name: string; value: number}[] = [];
  fitnessSumArr: {name: string; value: number}[] = [];
  public status: GeneticEnvironmentStatus = 'Stopped';
  private _geneticAlgorithm: GeneticAlgorithm<any>;
  private _unsub: Unsubscribe;

  updateOptions: EChartOption = {};

  options: EChartOption = {
    title: {
      text: 'Fitness evolution',
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
      formatter: 'Iteration {b}<br/>{a} : {c}',
    },

    dataZoom: [
      {
        type: 'inside',
        start: 10,
        end: 100,
      },
      {
        start: 10,
        end: 100,
        handleIcon:
          // tslint:disable-next-line: max-line-length
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
    ],

    xAxis: {
      type: 'category',
      data: [],
      splitLine: {
        show: false,
      },
    },

    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
      },
    },

    series: [
      {
        name: 'Best fitness',
        type: 'line',
        sampling: 'average',
        hoverAnimation: false,
        showSymbol: false,
        data: [],
      },
    ],
  };

  initOpts = {
    renderer: 'canvas',
    width: 600,
    height: 400,
  };

  @Output() stop = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() population = new EventEmitter<Population>();

  @Input() useChart = true;
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
      // Basic infos
      this.iteration = i;
      this.fitnessMax = population.fittest.fitnessScore;
      this.fitnessMean = population.meanFitness;
      this.fitnessSum = population.sumFitness;
      this.iterationArr.push('' + i);
      this.fitnessMaxArr.push({name: '' + i, value: this.fitnessMax});

      // Echarts
      this.updateOptions = {
        xAxis: {
          data: this.iterationArr,
        },
        series: [
          {
            data: this.fitnessMaxArr,
          },
        ],
      };
      if (i % 10 === 0) {
        this.changeDetectorRef.markForCheck();
      }
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

  get shallDisplayChart(): boolean {
    return this.useChart && !!this.geneticAlgorithm;
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
        this.status = 'Stopped';
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  pauseEnv(): void {
    this.status = 'Paused';
    this.geneticAlgorithm.pause();
  }
}
