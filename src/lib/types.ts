import {NodePath, TraverseOptions} from "@babel/traverse";
import {ClassDeclaration} from "@babel/types";

interface IPresetTraverseOptions {
    path: NodePath<ClassDeclaration>,
    res: { found: boolean },
    enableLogging?: boolean,
}

export type PresetTraversePredicate = (options: IPresetTraverseOptions) => TraverseOptions;

export interface IConfig {
    directory: string;
    predicate: PresetTraversePredicate;
    enableLogging?: boolean;
    parallelLimit?: number;
}