import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Icon = ({name, label, provider}) => {
    if (provider === 'fa' || provider === 'fa-regular') {
        return <FontAwesomeIcon icon={`${name}`}/>
    } else {
        return <img src={name} aria-label={label} alt=""/>
    }
}