#!/usr/bin/env node

"use strict";

require("yargs")
    .usage('$0 command')
    .command('analyse', 'Analyse a JavaScript file and find the standard library features that it is using', {
        file: {
            string: true,
            describe: 'The file that should be analysed',
            demandOption: true
        }
    }, async function parseFile(argv) {
        const path = require('path');
        const babel = require("@babel/core");
        const plugin = require('./src');
        const fs = require('fs');
        const os = require('os');
        const promisify = require('util').promisify;
        const readFile = promisify(fs.readFile);
        const mkdtemp = promisify(fs.mkdtemp);
        
        const file = path.join(process.cwd(), argv.file);
        const fileContents = await readFile(file, 'utf-8');
        const tempFolder = await mkdtemp(path.join(os.tmpdir(), 'js-features-analyser'));
        const outputDestination = path.join(tempFolder, 'features.json');

        try {
            babel.transformSync(fileContents, {
                plugins: [
                    [
                        plugin, {
                            outputDestination
                        }
                    ]
                ],
                filename: file,
                ast: false,
                code: false
            });
            
            console.log(fs.readFileSync(outputDestination, 'utf-8'));

        } catch (error) {
            if (error instanceof SyntaxError) {
                console.log("Failed to parse the JavaScript from xxx because it has a syntax error.")
                delete error.stack;
                delete error.code;
                delete error.pos;
                delete error.loc;
                const result = /: (?<errorType>[\w ]+) \((?<position>\d+:\d+)\)/.exec(error.message);
                console.log(result.groups.errorType)
                error.message = error.message.replace(` ${result.groups.errorType} `, '');
                error.message = error.message.replace(`(${result.groups.position})`, result.groups.position);
                console.error(error.message);
            }
        }
    })
    .help()
    .strict()
    .argv;