import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FitnessFunctionObjective,
  GeneticAlgorithm,
  Population,
  NoMutation,
} from 'genetically';
@Component({
  selector: 'app-sentence-example',
  templateUrl: './sentence-example.component.html',
  styleUrls: ['./sentence-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentenceExampleComponent implements OnInit {
  public objectiveSentence = 'Earth has few secrets from the birds';
  public randomSentence = '';
  public geneticAlgorithm: GeneticAlgorithm<string, string>;
  public fittestScore: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.onUpdateRandomSentence();
    this.createGeneticAlgorithm();
    this.changeDetectorRef.markForCheck();
  }

  onStartEnvironment() {
    console.log('start');
  }
  onStopEnvironment() {
    console.log('stop');
  }
  onUpdateRandomSentence() {
    this.randomSentence = this.generateRandomSentence(
      this.objectiveSentence.length
    );
    this.changeDetectorRef.markForCheck();
  }

  createGeneticAlgorithm() {
    this.geneticAlgorithm = new GeneticAlgorithm<string, string>(
      this.encode,
      this.decode,
      () => this.generateRandomSentence(this.objectiveSentence.length),
      (sentence) => {
        return this.fitness(sentence, this.objectiveSentence);
      },
      {
        population: {
          popsize: 1,
        },
        mutation: new NoMutation(),
        crossover: (chains: string[], mutation) => {
          return chains.map((chain) => {
            const asArr = chain.split('');
            const randomChainIndex = Math.ceil(
              Math.random() * chain.length - 1
            );
            const modulo = (n: number, mod: number) => ((n % mod) + mod) % mod;
            const charCode =
              chain.replace(' ', '{').charCodeAt(randomChainIndex) - 97;
            const nChar = String.fromCharCode(
              modulo(charCode - 1, 26) + 97
            ).replace('{', ' ');
            // asArr[randomChainIndex] = nChar;
            asArr[randomChainIndex] = this.objectiveSentence[randomChainIndex];
            const nStr = asArr.join('');
            if (chain.length !== nStr.length) {
              console.log('nStr', nStr);
              console.log('chain', chain);
              throw new Error('Error in size before mutation');
            }
            const mStr = mutation.mutation(nStr);
            if (chain.length !== nStr.length) {
              throw new Error('Error in size after mutation');
            }
            return mStr;
          });
        },
        // crossover: new NoCrossover(),
        objective: FitnessFunctionObjective.MINIMIZE,
        iterations: 2500,
        waitBetweenIterations: () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 20);
          });
        },
        stopCondition: (pop: Population<string>) => {
          return pop.fittest.fitnessScore === 0;
        },
      }
    );

    this.changeDetectorRef.markForCheck();
  }

  /**
   * @param sentence A normal string
   */
  encode(sentence: string): string {
    return sentence;
  }

  /**
   * @param n CharCode between 0 and 26
   */
  decode(sentence: string): string {
    return sentence;
  }

  /*
   * Create a random sequence of numbers of the length of the objective sentence
   */
  generateRandomSentence(len: number): string {
    // Create an array of the objective's length
    const randomSentence = Array(len)
      // Make a valid array
      .fill(undefined)
      // Create a random character for each element
      .map(() => {
        // One random number
        const n = Math.round(Math.random() * 26);

        // Convert it into a character
        const c = String.fromCharCode(n + 97);

        // Return
        return c.replace(/{/g, ' ');
      })
      // Join the array of character into a string
      .join('');
    return randomSentence;
  }

  /**
   * Fitness function of a given sentence is it's distance to the objective sentence
   */
  fitness(sentence: string, objectiveSentence: string): number {
    return sentence.split('').reduce((acc, curr, i) => {
      const objCode = objectiveSentence.toLowerCase().charCodeAt(i) || 96;
      const curCode = curr.charCodeAt(0) || 96;
      const delta = Math.abs(objCode - curCode);
      return delta + acc;
    }, 0);
  }
}
