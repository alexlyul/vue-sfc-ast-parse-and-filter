import {PresetTraversePredicate} from "../types";

/**
 * @description This preset will find Vue SFC class-based components that have uninitialized class properties
 * also known as the ones without reactivity :)
 * Examples:
 * 1. protected prop1!: string;
 * 2. prop2?: any;
 * It will ignore props that have decorators (e.g., @Prop, @Ref, etc.) and those that are marked with definite assignment too
 */
export const presetClassFieldsUndefinedWithReactivityIssues: PresetTraversePredicate = ({path, res}) => {
    return {
        ClassMethod(methodPath) {
            // skip methods, getters, setters
            methodPath.skip();
        },
        ClassProperty(propertyPath) {
            const {value, decorators, definite, declare} = propertyPath.node;
            // skip decorators (@Prop, @Ref...)
            if (decorators && decorators.length > 0) {
                return;
            }
            // Ignore if it's a definite assignment (e.g., prop!: Type) or "declare"
            if (definite || declare) {
                return;
            }
            // We're only interested in properties that have no value
            if (value === null) {
                res.found = true;
                path.stop();
            }
        }
    }
};