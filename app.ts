import * as fs from 'fs';

const DEBUG = true;

interface IAttributes {
  [name: string]: number
}

interface IIndividual {
  name: string,
  attributes: IAttributes
}

interface IRawData {
  team: Array<IIndividual>,
  applicants: Array<IIndividual>
}

interface IEvaluation {
  name: string,
  score: number
}

/**
 * A function to load in a specified json file
 * TODO: Take an argument to load any json file
 * @returns {IRawData} The JSON object from the saved file
 */
function loadJsonFile(): Promise<IRawData> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      './input.json',
      'utf-8',
      (e, data) => {
        if (e) {
          reject(Error(`Error reading file: ${e}`));
        } else {
          resolve(JSON.parse(data));
        }
      },
    );
  });
}

/**
 * A function to find the average value of each individual attribute of a team
 * @param teamInfo Array<IIndividual> An array of objects with the shared attributes of the team
 * @returns {IAttributes} An object with the average values of the shared attributes
 */
function averageTeam(teamInfo: Array<IIndividual>): IAttributes {
  const attributeSums: IAttributes = teamInfo.reduce((result: IAttributes, member, _idx) => {
    const newResult = result;
    /* Add up the attribute total across the team */
    Object.entries(member.attributes).forEach(([key, val]) => {
      if (_idx === 0) {
        newResult[key] = val;
      } else {
        newResult[key] += val;
      }
    });
    return newResult;
  }, {});
  const attributeAverage:IAttributes = {};
  Object.entries(attributeSums).forEach(([key, val]) => {
    attributeAverage[key] = val / teamInfo.length;
  });
  return attributeAverage;
}

function evaluateCandidates(
  teamAverage: IAttributes,
  candidateList: Array<IIndividual>,
): Array<IEvaluation> {
  return candidateList.reduce((result, candidate) => {
    /* Candidates start at 10 points per attribute and lose points for every 
     * point off they are from the team average.
     */
    const newResult = result;
    let scoreTotal = 0;
    Object.entries(teamAverage).forEach(([key, val]) => {
      try {
        scoreTotal += (10 - Math.abs(val - candidate.attributes[key]));
      } catch (e) {
        scoreTotal += 0;
      }
    });
    /* Average out the attribute scores and divide by 10 to get between 0 and 1 */
    scoreTotal /= Object.entries(teamAverage).length;
    scoreTotal /= 10;
    return [
      ...newResult,
      {
        name: candidate.name,
        score: scoreTotal.toFixed(1),
      },
    ];
  }, []);
}

function printToJson(jsonObjecT) {

}

async function compatibilityPredictor() {
  const rawData: IRawData = await loadJsonFile(); /* Await is used since everything needs this data */
  const teamAverage = averageTeam(rawData.team);
  const score = evaluateCandidates(teamAverage, rawData.applicants);
  if (DEBUG) {
    console.dir(teamAverage);
    console.dir(score);
  }
}

compatibilityPredictor();
