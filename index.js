#! /usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');

// TODO: allow user args for different database.yml locations
// var userArgs = process.argv.slice(2);

try {
  let databaseNames;

  // check if database exists in config
  if (fs.existsSync('./config/database.yml')) {
    console.log('database.yml exists');
    // fetch database names
    const databaseConfig = fs.readFileSync('./config/database.yml', 'utf8');

    // map into array of names
    databaseNames = databaseConfig
      .split('\n')
      .filter(line => line.includes('database'))
      .map(name => name.split(': ')[1]);
  } else {
    // if database.yml doesn't exist, set databaseNames to null and prompt later
    databaseNames = null;
  }

  // fetch dump files
  const files = fs.readdirSync('.');

  // filter root files by .dump extension
  const dumpFiles = files.filter(file => {
    // return all dump files
    return file.includes('.dump');
  });

  const questions = [
    {
      type: 'list',
      name: 'dumpFile',
      message: 'Which dump file do you want to use to restore?',
      choices: dumpFiles
    }
  ];

  // if database names and dump files are both found, start prompts
  if (databaseNames && dumpFiles.length) {
    // add database question to beginning of questions
    questions.unshift({
      type: 'list',
      name: 'database',
      message: 'Which database do you want to restore?',
      choices: databaseNames
    });

    // start prompts
    inquirer.prompt(questions).then((answers) => {
      const selectedDatabase = answers.database;
      const selectedDumpFile = answers.dumpFile;
      // execute command
      shell.exec(`pg_restore --verbose --clean --no-acl --no-owner -h localhost -U $USER -d ${selectedDatabase} ${selectedDumpFile}`);
      console.log(chalk.green(`Successfully restored database ${selectedDatabase}`));
    });
  } else if (databaseNames === null && dumpFiles.length) {
    console.log(chalk.black.bgRed("Couldn't find database.yml"));

    questions.unshift({
      type: 'input',
      name: 'database',
      message: 'Please Enter Your Database Name'
    });

    inquirer.prompt(questions).then((answers) => {
      const selectedDatabase = answers.database;
      const selectedDumpFile = answers.dumpFile;
      // execute command
      shell.exec(`pg_restore --verbose --clean --no-acl --no-owner -h localhost -U $USER -d ${selectedDatabase} ${selectedDumpFile}`);
      console.log(chalk.green(`Successfully restored database ${selectedDatabase}`));
    });
  } else {
    console.log(chalk.black.bgRed('PG Restore Failed:'));
    !databaseNames
      ? console.log(chalk('- Cannot Find Database Config (should be at ./config/database.yml)'))
      : null;
    dumpFiles.length === 0
      ? console.log(chalk('- No Dump Files Found (should be in project root directory)'))
      : null;
  }
} catch (error) {
  console.log(chalk.black.bgRed(`Error: ${error}`));
}
