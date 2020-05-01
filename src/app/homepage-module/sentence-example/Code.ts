export const CodeCreateGeneticAlgorithm = `
  function createGeneticAlgorithm() {
    this.geneticAlgorithm = new GeneticAlgorithm<string, string>(
      this.encode,
      this.decode,
      () => this.generateRandomSentence(this.objectiveSentence.length),
      (sentence) => this.fitness(sentence, this.objectiveSentence),
      {
        population: {
          popsize: 1,
        },
        mutation: new NoMutation(),
        crossover: (chains: string[], mutation) => {
          return chains.map((chain) => {
            const asArr = chain.split('');
            const randomChainIndex = Math.ceil( Math.random() * chain.length - 1);
            const modulo = (n: number, mod: number) => ((n % mod) + mod) % mod;
            const charCode = chain.replace(' ', '{').charCodeAt(randomChainIndex) - 97;
            const nChar = String.fromCharCode(modulo(charCode - 1, 26) + 97).replace('{', ' ');
            asArr[randomChainIndex] = nChar;
            const nStr = asArr.join('');
            const mStr = mutation.mutation(nStr);
            return mStr;
          });
        },
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
          return pop.fittest.fitnessScore <= 32;
        },
      }
    );`;
