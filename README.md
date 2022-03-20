# dh-compatibility-predictor

## To use

### Assumptions
  * Attribute rating scale is 1-10
  * Compatibility is determined by similar score to the team
  * All attributes are weighted equally

### Algo
  * Read in input file (user prompt for custom?)
  * Average attribute scores of the team
  * Evaluate applicants against the team average
    * Subtract one point for every point of difference to the average
    * Average out the adjusted score for all *applicable* attributes
    * Divide that score by 10 to get into the required range
  * Save back into output JSON file