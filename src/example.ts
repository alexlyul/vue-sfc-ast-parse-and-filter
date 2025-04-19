import {findMatchingSFCs} from "./index";
import {presetClassFieldsUndefinedWithReactivityIssues, presetClassFieldsWithThisReference} from "./index";


findMatchingSFCs({
    directory: "/vue-project/src",
    predicate: presetClassFieldsUndefinedWithReactivityIssues,
    enableLogging: true,
});


findMatchingSFCs({
    directory: "/vue-project/src",
    predicate: presetClassFieldsWithThisReference,
    enableLogging: true,
});