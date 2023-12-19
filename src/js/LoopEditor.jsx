import React, {forwardRef} from "react";
import {NumberField, TextField} from "./Field.jsx";

export const ValueEditor = forwardRef(({value, editable, ...props}, ref) => {
    if (value == null) {
        return <span className={"txt-null"}>null</span>;
    }
    /*    if (typeof (value) === 'boolean') {
            return <CheckboxField defaultValue={value} {...props} />
        }*/
    if (typeof (value) === 'number') {
        return <NumberField ref={ref} value={value} {...props} />
    }
    if (typeof (value) === 'string') {
        return <TextField ref={ref} value={value} {...props} />
    }
    if (typeof (value) === 'boolean') {
        return value ? "true" : "false";
    }
    return value;
});

export const LoopOverRange = ({from, to}) => {
    return <div className={"loop-over"}>
        <h3>Loop over range</h3>
        <div>
            <ValueEditor step={1} value={from || 1}/>
            to
            <ValueEditor value={to}/>
        </div>
    </div>;
}

export const LoopWhile = ({loopCondition}) => {
    return <div className={"loop-while"}>
        <h3>Loop condition</h3>
        <div>
            <ValueEditor value={loopCondition}/>
        </div>
    </div>;
};