import fs from 'node:fs';
import path from 'node:path';
import {parse as parseVueSFC} from '@vue/compiler-sfc';
import * as babel from '@babel/parser';
import traverse, {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import {IConfig, PresetTraversePredicate} from "./types";
import {logger} from "./logger";
import {ClassDeclaration} from "@babel/types";


function hasMatchingClassComponent(scriptTagContent: string, predicate: PresetTraversePredicate, enableLogging: boolean): boolean {
    try {
        const ast = babel.parse(scriptTagContent, {
            sourceType: 'module',
            plugins: ['typescript', 'decorators-legacy']
        });

        let foundClassComponent = false;
        const res = {found: false};

        traverse(
            ast,
            {
                ClassDeclaration(path: NodePath<ClassDeclaration>) {
                    const decorators = path.node.decorators;
                    if (decorators) {
                        for (const decorator of decorators) {
                            if (
                                t.isCallExpression(decorator.expression) &&
                                t.isIdentifier(decorator.expression.callee, {name: 'Component'})
                            ) {
                                foundClassComponent = true;
                            }
                        }
                    }
                    if (foundClassComponent) {
                        path.traverse(predicate({
                            path,
                            res,
                            enableLogging
                        }));
                    }
                },
            }
        );

        return foundClassComponent && res.found;
    } catch (error) {
        logger.error(error);
        return false;
    }
}


/**
 * @description Filters SFCs in a directory based on a given predicate function
 * @param {Object} config - Configuration object for the method.
 * @param {string} config.directory - The directory path where the SFCs are located.
 * @param {Function} config.predicate - The predicate function used to validate the SFC's script content.
 * @param {boolean} [config.enableLogging=false] - Flag to enable or disable logging during execution.
 * @return {string[]} An array of file names representing the SFCs that match the provided predicate.
 */
function filterSFCs({directory, predicate, enableLogging = false, parallelLimit = 10}: IConfig): string[] {
    const vueFiles = (fs.readdirSync(directory, {recursive: true}) as string[]).filter(file => file.endsWith('.vue'));
    const matchingFiles: string[] = [];

    for (let filePath of vueFiles) {
        filePath = path.join(directory, filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const {descriptor} = parseVueSFC(content);
        if (descriptor.script?.content && hasMatchingClassComponent(descriptor.script.content, predicate, enableLogging)) {
            matchingFiles.push(filePath);
        }
    }

    if (enableLogging) {
        logger('Total Vue SFCs:', vueFiles.length);
        logger('Matching SFCs:', matchingFiles.length);
    }

    return matchingFiles;
}


/**
 * @description Will return an array of matching Vue SFCs (class-based components only)
 * @param {IConfig} config
 * @returns {string[]} - An array of .vue file paths
 */
export function findMatchingSFCs(config: IConfig): string[] {
    const vueSFCs = filterSFCs(config);

    if (config.enableLogging) {
        logger(
            'Vue files with class-based components:\n' +
            vueSFCs.map((i) => '\t' + i.replaceAll('\\', '/')).join('\n')
        );
    }
    return vueSFCs;
}