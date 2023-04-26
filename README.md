# ts-hmmer

Preparation for HMMER use for nucleosome detection and integration to the Galaxy Platform

## Prerequisites

  - NodeJS
  - npm
  
## Running

After cloning the initial run requires `npm ci` to install the required dependencies.

To run a complete workflow, run `npm run start <read-length> <input-file>`.
At the moment ir requires data to be in `data/` folder.

Arguments are accepted in order:
  -Read length - main read length of the file provided
  -Input file - input file which should be handled
