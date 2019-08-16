# PG Restore Cli

## Extremely simple CLI for using pg_restore
### (Currently set up for Rails projects by default)

## Install

``` $ npm install -g pgrestore-cli ```

or

``` $ yarn global add pgrestore-cli ```

## Usage

- Run command `pgr` in the root of your project
- Looks for list of databases in `./config/database.yml`
- Gets list of `.dump` files
- CLI select interface to select both
- Runs pg_restore with the selected parameters

## Screenshots

![example photo](https://raw.githubusercontent.com/mattfwood/pgrestore-cli/master/screenshot.png)
