import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {GeneticAlgorithm} from 'genetically';
import {levenshtein} from 'src/classes/Levenshtein';

@Component({
  selector: 'app-sentence-example',
  templateUrl: './sentence-example.component.html',
  styleUrls: ['./sentence-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentenceExampleComponent implements OnInit {
  public objectiveSentence = 'Earth has few secrets from the birds';
  public randomSentence: string;
  public encoded: number[];
  public decoded: string;
  public geneticAlgorithm: GeneticAlgorithm<string, string>;

  constructor() {}

  ngOnInit() {
    this.generateRandomSentence();
    this.createGeneticAlgorithm();
  }

  onStartEnvironment() {
    console.log('start');
  }
  onStopEnvironment() {
    console.log('stop');
  }
  onChangeObjective() {}

  createGeneticAlgorithm() {
    this.geneticAlgorithm = new GeneticAlgorithm<string, string>(
      this.encode,
      this.decode,
      this.generateRandomSentence,
      this.fitness
    );
  }

  /**
   *
   * @param sentence A normal string
   */
  encode(sentence: string): string {
    return sentence;
  }

  /**
   *
   * @param n CharCode between 0 and 26
   */
  decode(encodedCharacters: string): string {
    return encodedCharacters;
  }

  /*
   * Create a random sequence of numbers of the length of the objective sentence
   */
  generateRandomSentence(): string {
    const l = this.objectiveSentence.length;

    // Create an array of the objective's length
    const randomSentence = Array.from(Array(l))
      // Create a random character for each element
      .map(() => {
        // One random number
        const n = Math.round(Math.random() * 26);

        // Convert it into a character
        const c = String.fromCharCode(n + 97);

        // Transform the character corresponding to CharCode 123 to have spaces
        return c.toLowerCase().replace(' ', '{');
      })
      // Join the array of character into a string
      .join('');
    return randomSentence;
  }

  /**
   * Fitness function of a given sentence is it's distance to the objective sentence
   * Use the levenshtein distance function
   */
  fitness(sentence: string): number {
    return levenshtein(sentence, this.objectiveSentence);
  }
}
