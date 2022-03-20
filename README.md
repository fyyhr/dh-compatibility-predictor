# dh-compatibility-predictor

## To use
Within nodeJS:  
A built `app.js` file should be available to you, if not, you will need to build it:  
```
npm install
```
```
npm run build
```

Once everything has been built and `app.js` is available, simply do
```
node app.js
```
### Inputs
Currently, inputs must be done prior to running the app. Make modifications to the `input.json` file as you see fit.

### Outputs
Currently, the output is hardcoded to save in the project directory with the name `output.json`.


### Assumptions
  * Attribute rating scale is 1-10 in whole numbers
  * Compatibility is determined by similar score to the team
  * All attributes are weighted equally
  * Listed attributes are the same within the team
    * Not all attributes may be present on applicants, though!

### Algo
  * Read in input file
  * Average attribute scores of the team
  * Evaluate applicants against the team average
    * Subtract one point for every point of difference to the average
    * Average out the adjusted score for all *applicable* attributes
    * Divide that score by 10 to get into the required range
  * Save back into output JSON file