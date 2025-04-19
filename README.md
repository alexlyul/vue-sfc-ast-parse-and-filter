# vue-sfc-ast-parse-and-filter
## About
This utility is designed to parse Vue Single File Components (SFCs) and filter out specific ones based on user-defined criteria. 
It uses the `@vue/compiler-sfc` package to extract script content and the `@babel/parser` with `@babel/traverse` packages for traversing the AST.  
It is used to make refactoring of Vue SFCs easier and to spot broken syntax using one of the presets.

Currently, presets are made to work with vue-class-component, but you can create your own custom predicates to filter out specific SFCs based on your needs.

## How to use
### Existing presets:

1. Find class properties with no value assigned. Such fields are not reactive and will not be tracked by Vue's 2.x reactivity system.
```javascript
import {findMatchingSFCs} from "./index";
import {presetClassFieldsUndefinedWithReactivityIssues} from "./index";

findMatchingSFCs({
    directory: "/vue-project/src",
    predicate: presetClassFieldsUndefinedWithReactivityIssues,
    enableLogging: true,
});
```

2. Find class properties with `this` reference. If you're trying to move to newer ES standards and migrating from TypeScript 3.x to 4.5+, 
   you might want to find all class properties that are using `this` reference and refactor them to being initialized in the hooks.
```javascript
import {findMatchingSFCs} from "./index";
import {presetClassFieldsWithThisReference} from "./index";

findMatchingSFCs({
    directory: "/vue-project/src",
    predicate: presetClassFieldsWithThisReference,
    enableLogging: true,
});
```

### Create your own custom preset:
AST viewer to explore your script structure: https://ts-ast-viewer.com/

Example:
```javascript
import {PresetTraversePredicate} from "../types";

export const customPresetFindClassProperties: PresetTraversePredicate = ({path, res}) => {
    return {
        ClassMethod(methodPath) {
            methodPath.skip();
        },
        ClassProperty(propertyPath) {
            res.found = true;
        }
    }
};
```