import {findMatchingSFCs} from "./index";
import {presetClassFieldsUndefinedWithReactivityIssues, presetClassFieldsWithThisReference} from "./index";

const projectPath = "/vue-project/src";

findMatchingSFCs({
    directory: projectPath,
    predicate: presetClassFieldsUndefinedWithReactivityIssues,
    enableLogging: true,
});


findMatchingSFCs({
    directory: projectPath,
    predicate: presetClassFieldsWithThisReference,
    enableLogging: true,
});