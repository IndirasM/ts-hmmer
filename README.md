# ts-hmmer

Preparation for HMMER use for nucleosome detection and integration to the Galaxy Platform

## Prerequisites

  - [NodeJS](https://nodejs.org/en)
  - [npm](https://www.npmjs.com/) (installed with NodeJS)
  - [HMMER](http://hmmer.org/)
  - [ClustalO](http://www.clustal.org/) (or ClustalW with modifications)

  HMMER and Clustal are optional requirements - they are being run only in a couple of modes of the application.
  
## Running

### Application modes

Note: HMMER requires sequences from which HMMs are built to be of the same length. This application determines the most common sequence length from data provided and uses that as a base length.

0 - Generator - generates data by going through each sequence, cutting a 147bp segment from it, moving the window by 1 bp and repeating the process. Can generate a large amount of data from sequences - the more and longer - the more generated.

1 - Preparator - cleans and prepares files for hmmbuild use. Main use for most cases. Can merge multiple sequence files into a single prepared one if one file is provided.

2 - Merge - merges sequences into one big sequence.

3 - Lowercase For Alignment - Alignment for large files with short sequences was done with [MAFFT](https://mafft.cbrc.jp/alignment/server/large.html?aug31). MAFFT by default requires nucleotides to all be lowercase, otherwise it will be treated as an aminoacid. This mode is used to prepare files to be used in MAFFT.

4 - Split - this mode requires HMMER and ClustalO (or ClustalW with modifications) to be used. Without HMMER an error will be thrown, but big sequence files will still be split up in chunks of 100 sequences. If HMMER is present, it will be used to train multiple small HMMs for each chunk of sequences and one large HMM database will be created from them. This mode works in 3 steps - firstly it will split the input file into chunks of 100 sequences, the next step will be multiple sequence alignment using ClustalO, and the next step will be the use of HMMER via `hmmbuild` to build a series of HMMs for each cluster, finally, all of the small HMMs will be combined into a singular HMM database to search against.

5 - Sequence Naming - in case a FASTA file only has the starting name mark (>) but no name, this mode will add indices as names to the sequences.

6 - Unique Filter - [**EXPERIMENTAL**] This mode filters out non-unique sequences. In current state, it only filters out according to the uniquity of the string - it can remove lines from a FASTA file if the name or the sequence itself matches another one. Be careful when using this.
A suggestion would be to use tools currently available on [The Galaxy Platform](https://usegalaxy.org/)

7 - Sequence shortener - This mode takes the sequences and cuts a 140bp section from the middle of it. This mode was created to have a simplified version of the training data as it has the center of the nucleosome in the middle.

8 - Filtered nHMMER runner - this mode requires HMMER to be present. It runs the `nhmmer` command and outputs a file that was filtered in a way, so that outputs with 0 hits are removed. Inputs are required in the same order as usual - hmm input file and sequences file.

### Installation and running

After cloning the initial run requires `npm ci` to install the required dependencies.

To run a complete workflow, run `npm run start <mode> <input-file(s)>`.
All the outputs of the application will be placed in the `output` folder.
The `Split` mode will create subfolders for `sequences` and `models` as it can require a large amount of files to be created and in that case they become hardly readable.

Arguments are accepted in order:
  -Mode - enter the number of the mode that you'd like the application to run in
  -Input file(s) - input file which should be handled. Some modes accept multiple files if required.
