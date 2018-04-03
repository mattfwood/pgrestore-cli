#! /usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

// var userArgs = process.argv.slice(2);

try {
  // fetch database names
  const databaseConfig = fs.readFileSync('./config/database.yml', 'utf8');

  // map into array of names
  const databaseNames = databaseConfig
    .split('\n')
    .filter(line => line.includes('database'))
    .map(name => name.split(': ')[1]);

  // fetch dump files
  const files = fs.readdirSync('.');

  // filter root files by .dump extension
  const dumpFiles = files.filter(file =>
    // return all dump files
    file.includes('.dump'));

  const questions = [
    {
      type: 'list',
      name: 'database',
      message: 'Which database do you want to restore?',
      choices: databaseNames,
    },
    {
      type: 'list',
      name: 'dumpFile',
      message: 'Which dump file do you want to use to restore?',
      choices: dumpFiles,
    },
  ];

  if (databaseNames.length && dumpFiles.length) {
    inquirer.prompt(questions).then((answers) => {
      const selectedDatabase = answers.database;
      const selectedDumpFile = answers.dumpFile;
      // execute command
      shell.exec(`pg_restore --verbose --clean --no-acl --no-owner -h localhost -U $USER -d ${selectedDatabase} ${selectedDumpFile}`);
      console.log(chalk.green(`Successfully restored database ${selectedDatabase}`));
    });
  } else {
    console.log(chalk.black.bgRed('Missing Resources:'));
    databaseNames.length === 0
      ? console.log(chalk('Database Config (should be at ./config/database.yml)'))
      : null;
    dumpFiles.length === 0
      ? console.log(chalk('Dump Files (should be in project root directory)'))
      : null;
  }
} catch (error) {
  console.log(chalk.black.bgRed(`Error: ${error}`));
}
