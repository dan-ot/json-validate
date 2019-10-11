const { Validator } = require('jsonschema');
const { readFile, writeFile } = require('fs');
const yargs = require('yargs');

yargs
  .command(['$0', 'check'], 'Check the validity of a JSON config against a JSON schema',
    (yargs) => yargs
      .option({
        'c': {
          alias: 'config',
          default: './config.json',
          defaultDescription: 'Reads "config.json" from the current folder',
          normalize: true,
          describe: 'A JSON-based configuration',
          requiresArg: true,
          type: 'string'
        }
      })
      .option({
        's': {
          alias: 'schema',
          default: './schema.json',
          defaultDescription: 'Reads "schema.json" from the current folder',
          normalize: true,
          describe: 'A JSON-schema file',
          requiresArg: true,
          type: 'string'
        }
      }),
    (args) => {
      const v = new Validator();
      readFile(args.s, 'utf8', (err, schemaString) => {
        if (err) {
          console.error(`Couldn't read schema [${args.s}]`, err);
        } else {
          const schema = JSON.parse(schemaString);
          readFile(args.c, 'utf8', (err, configString) => {
            if (err) {
              console.error(`Couldn't read config [${args.c}]`, err);
            } else {
              const j = JSON.parse(configString);
              const result = v.validate(j, schema);
              if (result.errors.length > 0) {
                result.errors.forEach(err => console.log(`Validation Error: ${err.property} -> ${err.message}`));
              } else {
                console.log(`Valid!`);
              }
            }
          });
        }
      });
    }
  )
  .demandCommand()
  .help()
  .argv;