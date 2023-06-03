import React from "react";
import 'font-awesome/css/font-awesome.min.css';
export const Icon = ({name, label, provider}) => {
    if( provider === 'fa' || provider === 'fontawesome' ){
        return <i className={`fa fa-${name}`} aria-label={label}></i>;
    }else{
        return <img src={name} aria-label={label} alt=""/>
    }
}