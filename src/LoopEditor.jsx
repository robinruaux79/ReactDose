import {CheckboxField, NumberField, TextField} from "./Field";

const ValueEditor = ({value, ...props}) => {
    if( typeof (value) === 'boolean'){
        return <CheckboxField {...props} />
    }else if( typeof (value) === 'number'){
        return <NumberField {...props } />
    }
    return <TextField {...props} />;
}

const FunctionEditor = ({value}) => {
    return <ValueEditor value={value} />;
};

const LoopEditor = ({scripts, loopOverFrom, loopOverTo, loopCondition}) => {
    return <div className={"loopeditor"}>
        <h2>Loop </h2>
        {!loopCondition && (
        <div className={"loop-over"}>
            <h3>Over range</h3>
            <div>
                <ValueEditor value={loopOverFrom} />
                to
                <ValueEditor value={loopOverTo} />
            </div>
            {scripts.map((script) => <FunctionEditor value={script} />)}
        </div>
        )}
        {loopCondition && (
        <div className={"loop-while"}>
            <h3>Condition</h3>
            <div>
                <ValueEditor value={loopCondition} />
            </div>
            {scripts.map((script) => <FunctionEditor value={script} />)}
        </div>
        )}
    </div>;
};