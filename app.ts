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

/**
 * A function to load in a specified json file
 * TODO: Take an argument to load any json file
 * @return {IRawData} The JSON object from the saved file
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

function averageTeam(teamInfo: Array<IIndividual>): IAttributes {
  const attributeSums: IAttributes = teamInfo.reduce((result: IAttributes, item, _idx) => {
    const newResult = result;
    Object.entries(item.attributes).forEach(([key, val]) => {
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

async function evaluateCandidates() {
  const rawData: IRawData = await loadJsonFile(); // Await is used since everything needs this data
  const teamAverage = averageTeam(rawData.team);
  if (DEBUG) {
    console.dir(teamAverage);
  }
}

evaluateCandidates();
