import {PresetTraversePredicate} from "../types";
import traverse, {Node, NodePath} from "@babel/traverse";
import {ClassProperty, isArrowFunctionExpression, isFunctionExpression} from "@babel/types";

/**
 * @description This preset will find Vue SFC class-based components with fields which reference to `this` in their initialization.
 * There is an issue when you try to migrate from TS 3.x to TS 4.5+ and get props being undefined
 * More: https://www.typescriptlang.org/tsconfig/#useDefineForClassFields
 * Examples:
 * 1. protected foo1! = this.bar1 + 4;
 * 2. foo2?: boolean = !this.bar2;
 * It will skip class methods
 */
export const presetClassFieldsWithThisReference: PresetTraversePredicate = ({path, res}) => {
    return {
        ClassProperty(propertyPath) {
            if (isFunctionExpression(propertyPath.node.value) || isArrowFunctionExpression(propertyPath.node.value)) {
                return;
            }
            const {value} = propertyPath.node;
            if (value && containsThisExpression(value, propertyPath)) {
                res.found = true;
                path.stop();
            }
        },
        ClassMethod(methodPath) {
            // Ignore all class methods (including getters and normal methods)
            methodPath.skip();
        }
    }
};


/**
 * @description Detects this expression in the node
 * @param node
 * @param path
 */
function containsThisExpression(node: Node, path: NodePath<ClassProperty>): boolean {
    let hasThis = false;
    traverse(
        node,
        {
            ThisExpression() {
                hasThis = true;
            }
        },
        path.scope,
        path.state,
        path.parentPath
    );
    return hasThis;
}