# PG Restore Cli

## Extremely simple CLI for using pg_restore
### (Currently set up for Rails projects by default)

- Run command `pgr` in the root of your project
- Looks for list of databases in `./config/database.yml`
- Gets list of `.dump` files
- CLI select interface to select both
- Runs pg_restore with the selected parameters