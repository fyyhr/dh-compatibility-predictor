"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const DEBUG = false;
/**
 * A function to load in a specified json file
 * TODO: Take an argument to load any json file
 * @returns {IRawData} The JSON object from the saved file
 */
function loadJsonFile() {
    return new Promise((resolve, reject) => {
        fs.readFile('./input.json', 'utf-8', (e, data) => {
            if (e) {
                reject(Error(`Error reading file: ${e}`));
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    });
}
/**
 * A function to find the average value of each individual attribute of a team
 * @param teamInfo Array<IIndividual> An array of objects with the shared attributes of the team
 * @returns {IAttributes} An object with the average values of the shared attributes
 */
function averageTeam(teamInfo) {
    const attributeSums = teamInfo.reduce((result, member, _idx) => {
        const newResult = result;
        /* Add up the attribute total across the team */
        Object.entries(member.attributes).forEach(([key, val]) => {
            if (_idx === 0) {
                newResult[key] = val;
            }
            else {
                newResult[key] += val;
            }
        });
        return newResult;
    }, {});
    const attributeAverage = {};
    Object.entries(attributeSums).forEach(([key, val]) => {
        attributeAverage[key] = val / teamInfo.length;
    });
    return attributeAverage;
}
/**
 * A function that evaluates individual candidates against a passed team average.
 * The evaluation is based on named attributes. Only attributes listed in the team's
 * average is considered in the evaluation. If a candidate does not have a listed attribute
 * they receive a score of 0 for that attribute. If a candidate has an attribute that
 * isn't listed for the team, that attribute is ignored. Final scores range from 0 to 1.
 * @param teamAverage IAttributes The average values of the team's attributes
 * @param candidateList The raw data of the candidate list
 * @returns Array<IEvaluation> Objects with the candidates name and their evaluated score.
 */
function evaluateCandidates(teamAverage, candidateList) {
    return candidateList.reduce((result, candidate) => {
        /* Candidates start at 10 points per attribute and lose points for every
         * point off they are from the team average.
         */
        /* Doing a percentage difference may be better? I feel that would be more
         * penalizing for the edges
         */
        const newResult = result;
        let scoreTotal = 0;
        Object.entries(teamAverage).forEach(([key, val]) => {
            if (candidate.attributes[key]) {
                scoreTotal += (10 - Math.abs(val - candidate.attributes[key]));
            }
            else {
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
/**
 * A function that writes the candidate evaluation to a JSON file
 * TODO: Allow the user to specify an output destination
 * @param jsonObject Array<IEvaluation> The evaluated candidates
 * @return {void}
 */
function printToJson(jsonObject) {
    fs.writeFile('./output.json', JSON.stringify(jsonObject, null, 2), ((e) => {
        if (e) {
            console.log(`There was an error writing the file ${e}`);
        }
        else {
            console.log('Evaluation completed and file has been written to output.json');
        }
    }));
}
/**
 * Driver function
 */
function compatibilityPredictor() {
    return __awaiter(this, void 0, void 0, function* () {
        /* Await is used since everything needs this data */
        const rawData = yield loadJsonFile();
        const teamAverage = averageTeam(rawData.team);
        const score = evaluateCandidates(teamAverage, rawData.applicants);
        if (DEBUG) {
            console.dir(teamAverage);
            console.dir(score);
        }
        printToJson(score);
    });
}
compatibilityPredictor();
//# sourceMappingURL=app.js.map