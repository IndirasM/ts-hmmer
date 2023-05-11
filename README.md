# ts-hmmer

Preparation for HMMER use for nucleosome detection and integration to the Galaxy Platform

## Prerequisites

  - [NodeJS](https://nodejs.org/en)
  - npm (installed with NodeJS)
  - [HMMER](http://hmmer.org/)

  HMMER is an optional requirement - it is being run by only 1 of the application modes.
  
## Running

### Application modes

Note: HMMER requires sequences from which HMMs are built to be of the same length. This application determines the most common sequence length from data provided and uses that as a base length.

0 - Generator - generates data by going through each sequence, cutting a 147bp segment from it, moving the window by 1 bp and repeating the process. Can generate a large amount of data from sequences - the more and longer - the more generated.

1 - Preparator - cleans and prepares files for hmmbuild use. Main use for most cases.

2 - Merge - merges sequences into one big sequence.

3 - Lowercase For Alignment - Alignment for large files with short sequences was done with [MAFFT](https://mafft.cbrc.jp/alignment/server/large.html?aug31). MAFFT by default requires nucleotides to all be lowercase, otherwise it will be treated as an aminoacid. This mode is used to prepare files to be used in MAFFT.

4 - Split - this mode requires HMMER to be used. Without HMMER an error will be thrown, but big sequence files will still be split up in chunks of 100 sequences. If HMMER is present, it will be used to train multiple small HMMs for each chunk of sequences and one large HMM database will be created from them.

5 - Sequence Naming - in case a FASTA file only has the starting name mark (>) but no name, this mode will add indices as names to the sequences.

6 - Unique Filter - [EXPERIMENTAL] This mode filters out non-unique sequences. In current state, it only filters out according to the uniquity of the string - it can remove lines from a FASTA file if the name or the sequence itself matches another one. Be careful when using this.

### Installation and running

After cloning the initial run requires `npm ci` to install the required dependencies.

To run a complete workflow, run `npm run start <read-length> <input-file>`.
At the moment ir requires data to be in `data/` folder.

Arguments are accepted in order:
  -Read length - main read length of the file provided
  -Input file - input file which should be handled
