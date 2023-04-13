
import React, { isValidElement, Children, cloneElement, useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from
'react';

import uniqid from 'uniqid';
import cn from 'classnames';
import { useRefs, recursiveMap } from './Utils.jsx';
import { Translate } from "./Globalization.jsx";

export const Form = ({ name, onValidate, onError, children, editable }) => {
    const [childrenRef, registerRef] = useRefs();
    const onSubmit = (e) => {
        let res = true;
        Object.keys(childrenRef.current).forEach((item) => {
            console.log(item,res)
            res = childrenRef.current[item].validate() && res;
            });
        if( res ){
            if (onValidate)
                onValidate();
        }else{
            if( onError )
                onError();
        }
        e.preventDefault();
    }

    /**/
    return <form name={name} noValidate={true} contentEditable={editable} className={cn({['form-'+name]: true})} onSubmit={onSubmit}>{recursiveMap(children, (child, index) => {
        if( child?.type?.displayName?.match(/(Field|RadioGroup)/)){
            return <child.type {...child.props} ref={registerRef(child?.type?.displayName.concat('-').concat(child.props.name || uniqid()))} />
        }
        return child;
    })}</form>
}

const TextField = forwardRef(function TextField({ name, label, placeholder, help, editable, defaultValue, required, readOnly, onChange, multiline, minlength, maxlength }, ref) {
    const id = 'textfield-'+'_'+uniqid();
    const [errors, setErrors] = useState([]);
    const [value, setValue] = useState(defaultValue || null);
    const validate = () => {
        const errs = [];
        if( required && (!value || value.trim() == '')){
            errs.push('Field required');
        }
        if( minlength && (typeof value == 'string' && value.trim().length < minlength) ){
            errs.push('Value length must be >= to ' + minlength);
        }
        if( maxlength && (typeof value == 'string'  && value.trim().length > maxlength) ){
            errs.push('Value length must be <= to ' + maxlength);
        }
        setErrors(errs);
        return !errs.length;
    }
    useImperativeHandle(ref, () => ({
        validate,
        getValue : () => value
    }));
    const handleChange = (e) => {
        setValue(e.target.value);
        if( onChange ){
            onChange(e);
        }
    }
    useEffect(() => {
        if( value !== null)
            validate();
    }, [value]);
    return (<><div className={cn({field: true, 'field-text': !multiline, 'field-multiline': multiline})}>
        <label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>

        {multiline && <textarea aria-required={required} aria-readonly={readOnly} readOnly={readOnly} placeholder={placeholder} id={id} name={name} value={value || ''} rows={8} onChange={handleChange} minLength={minlength} maxLength={maxlength}></textarea> }
        {!multiline && <input aria-required={required} aria-readonly={readOnly} readOnly={readOnly} type="text" placeholder={placeholder} id={id} name={name} value={value || ''} onChange={handleChange} minLength={minlength} maxLength={maxlength} />}
    </div>
        <ul className="error">
            {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
        </ul>
    </>);
});

TextField.displayName = 'TextField';
export { TextField };

const EmailField = forwardRef(({ name, label, placeholder, help, editable, defaultValue, required, readOnly, onChange, minlength, maxlength, fieldValidated }, ref) => {
    const id = 'emailfield-'+'_'+uniqid();
    const [errors, setErrors] = useState([]);
    const [value, setValue] = useState(defaultValue || null);
    const validate = () => {
        const errs = [];
        if( required && (!value || value.trim() == '')){
            errs.push('Field required');
        }
        if( minlength && (value && value.trim().length < minlength) ){
            errs.push('Value length must be >= to ' + minlength);
        }
        if( maxlength && (value && value.trim().length > maxlength) ){
            errs.push('Value length must be <= to ' + maxlength);
        }
        if (value && !value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            errs.push('Invalid email');
        }
        setErrors(errs);
        return !errs.length;
    }
    useEffect(() => {
        if( value !== null )
        validate();
    }, [value]);
    useEffect(() => {
        if( fieldValidated )
            validate();
    }, [fieldValidated]);
    useImperativeHandle(ref, () => ({
        validate,
        getValue : () => value
    }));
    const handleChange = (e) => {
        setValue(e.target.value);
        if( onChange ){
            onChange(e);
        }
    }
    return (<><div className={cn({field: true, 'field-email': true})}>
        <label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>
        <input aria-required={required} aria-readonly={readOnly} readOnly={readOnly} type="email" placeholder={placeholder} id={id} name={name} value={value || ''} onChange={handleChange} minLength={minlength} maxLength={maxlength} />
    </div>
        <ul className="error">
            {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
        </ul></>);
});
EmailField.displayName = 'EmailField';
export { EmailField };

const NumberField = forwardRef(({ name, label, placeholder, help, editable, defaultValue, required, readOnly, onChange, minlength, maxlength, min, max, step }, ref) => {
    const id = 'numberfield-'+'_'+uniqid();
    const [errors, setErrors] = useState([]);
    const [value, setValue] = useState(defaultValue || null);
    const validate = () => {
        const errs = [];
        if( required && (!value || value.trim() == '')){
            errs.push('Field required');
        }
        if( minlength && (value && value.trim().length < minlength) ){
            errs.push('Value length must be >= to ' + minlength);
        }
        if( maxlength && (value && value.trim().length > maxlength) ){
            errs.push('Value length must be <= to ' + maxlength);
        }
        if ((min || min === 0) && (value || value === 0) && min > value){
            errs.push('Value < to '+min);
        }
        if ((max || max === 0) && (value || value === 0) && max < value){
            errs.push('Value > to '+max);
        }
        setErrors(errs);
        return !errs.length;
    }
    useEffect(() => {
        if( value !== null )
        validate();
    }, [value]);
    useImperativeHandle(ref, () => ({
        validate,
        getValue : () => value
    }));
    const handleChange = (e) => {
        setValue(e.target.value);
        if( onChange ){
            onChange(e);
        }
    }
    return (<><div className={cn({field: true, 'field-number': true})}>
        <label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>
        <input aria-required={required} aria-readonly={readOnly} readOnly={readOnly} type="number" placeholder={placeholder} id={id} name={name} value={value || ''} onChange={handleChange} minLength={minlength} maxLength={maxlength} min={min} max={max} step={step} />
    </div>
    <ul className="error">
        {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
    </ul></>);
});
NumberField.displayName = 'NumberField';
export { NumberField };

const CheckboxField = forwardRef(({ name, label, placeholder, help, editable, defaultValue, required, readOnly, onChange, minlength, maxlength, checked }, ref) => {
    const id = 'checkfield-'+'_'+uniqid();
    const [errors, setErrors] = useState([]);
    const [value, setValue] = useState(defaultValue || null);
    const validate = () => {
        const errs = [];
        if( required && !value ){
            errs.push('Field must be checked.');
        }
        setErrors(errs);
        return !errs.length;
    }
    useEffect(() => {
        if( value !== null )
        validate();
    }, [value]);
    useImperativeHandle(ref, () => ({
        validate,
        getValue : () => value
    }));
    const handleChange = (e) => {
        setValue(!value);
        if( onChange ){
            onChange(e);
        }
    }
    return (<><div className={cn({field: true, 'field-checkbox': true})}>
        <input aria-required={required} aria-readonly={readOnly} readOnly={readOnly} type="checkbox" checked={value} placeholder={placeholder} id={id} name={name} onChange={handleChange} minLength={minlength} maxLength={maxlength} />
        <label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>
    </div>
    <ul className="error">
        {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
    </ul></>);
});
CheckboxField.displayName = 'CheckboxField';
export { CheckboxField };


const RadioField = forwardRef(({ name, label, placeholder, help, editable, checked, required, readOnly, onChange, minlength, maxlength }, ref) => {
    const id = 'radiofield-'+'_'+uniqid();
    const [errors, setErrors] = useState([]);
    const [value, setValue] = useState(checked || null);
    const validate = () => {
        const errs = [];
        if( required && !value ){
            errs.push('Field must be checked.');
        }
        setErrors(errs);
        return !errs.length;
    }
    useEffect(() => {
        if( value !== null )
        validate();
    }, [value]);
    useImperativeHandle(ref, () => ({
        validate,
        getValue : () => value
    }));
    const handleChange = (e) => {
        setValue(!value);
        if( onChange ){
            onChange(e);
        }
    }
    return (<><div className={cn({field: true, 'field-radio': true})}>
    <input aria-required={required} aria-readonly={readOnly} readOnly={readOnly} type="radio" checked={value} value={value || label} placeholder={placeholder} id={id} name={name} onChange={handleChange} minLength={minlength} maxLength={maxlength} />
        <label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>
        
    </div>
    <ul className="error">
        {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
    </ul></>);
});
RadioField.displayName = 'RadioField';
export { RadioField };

const RadioGroup = forwardRef(({id, label, help, editable, name, required, children}, ref)=> {
    const [childrenRef, registerRef] = useRefs();
    const [errors, setErrors] = useState([]);
    const validate = () => {
        const errs = [];
        let res = false;
        Object.keys(childrenRef.current).forEach((item ) => {
            res = !!childrenRef.current[item].getValue() || res;
        })
        console.log(res, required)
        if( !res && required ){
            errs.push('Field is required');
        }
        setErrors(errs);
        return !errs.length;
    }
    useImperativeHandle(ref, () => ({
        validate,
    }));
    const handleChange = () => {
        setTimeout(() => validate(), 0);
    }
    return <><label contentEditable={editable} className={cn({'help': !!help})} title={help} htmlFor={children[0].props.id}>{label}{required ? <span className="mandatory" contentEditable={false}>*</span> : ''}</label>
    {[recursiveMap(children, (child, index) => {
        if( child.type.displayName == 'RadioField'){
            const props = {...child.props, name: (name ?  name : child.props.name), onChange:() => handleChange(child.props.onChange)};
            return <child.type {...props} ref={registerRef('Radio'+index)} />;
        }
        return child;
    }),
    <ul className="error">
        {errors.map((e,key) => (<li key={key} aria-live="assertive" role="alert"><Translate>{e}</Translate></li>))}
    </ul>]}
    </>;
});

RadioGroup.displayName = 'RadioGroup';
export { RadioGroup };
