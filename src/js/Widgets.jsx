import React, {useRef, useState} from "react";
import {TextField} from "./Field.jsx";
import {Hyperlink} from "./Tags.jsx";

export const SearchBox = ({maxItems, values, filter, sort, onRenderItem, onSelect, value, ...rest}) => {

    const fieldRef = useRef();
    const [currentVal, setCurrentVal] = useState('');

    const selectListItem = (item) => {
        setCurrentVal(item.label);
        fieldRef.current.setValue(item.label);
        fieldRef.current.ref.focus();
        if (onSelect) {
            onSelect(item);
        }
    };
    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            var el = e.target.closest('.searchbox').querySelector('.listbox-item');
            if (el && document.activeElement === fieldRef.current.ref) {
                el.querySelector('.link-overall').focus();
            }
        }
    }

    return <div onKeyDown={onKeyDown} className="searchbox" {...rest}>
        <TextField ref={fieldRef} onChange={(e) => {
            setCurrentVal(e.target.value);
        }}/>
        <ListBox values={values || []} sort={sort} filter={(v =>
            currentVal ? v.label.toLowerCase().indexOf(currentVal.toLowerCase()) !== -1 : false)}
                 onSelect={selectListItem} onRenderItem={onRenderItem} size={20}/>
    </div>;
}

/**
 * ListBox
 * Composant de sélection parmi une liste d'éléments verticaux.
 * @param size Nombre d'éléments affichés
 * @param values Valeurs de la liste (peut être du JSON)
 * @param offset Offset dans la liste
 * @param filter Filtre appliqué aux valeurs
 * @param sort Tri
 * @param onRenderItem Callback to display
 * @param onSelect Callback
 * @param value
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
export const ListBox = ({size, values, offset, filter, sort, onRenderItem, onSelect, value, ...rest}) => {

    let searchValues = values;
    if (size == 0) {
        searchValues = [];
    } else {
        if (filter) {
            searchValues = searchValues.filter(filter);
        }
        if (sort) {
            searchValues = searchValues.sort(sort);
        }
        if (size > 0) {
            searchValues = searchValues.slice((offset || 0), (offset || 0) + size);
        }
    }
    const selectListItem = (item) => {
        if (onSelect)
            onSelect(item);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            var prev = document.activeElement.closest('.listbox-item').previousElementSibling;
            if (prev) {
                prev.querySelector('.link-overall').focus();
            }
        } else if (e.key === "ArrowDown") {
            var next = document.activeElement.closest('.listbox-item').nextElementSibling;
            if (next) {
                next.querySelector('.link-overall').focus();
            }
        }
    }

    const menu = (searchValues.length ?
        <div {...rest} aria-expanded={true} className="listbox" onKeyDown={onKeyDown}>
            {searchValues.map(v => {
                return typeof (onRenderItem) === 'function' ? onRenderItem(v, () => selectListItem(v)) :
                    <div className="listbox-item">
                        <Hyperlink onClick={() => selectListItem(v)}
                                   className="link-overall">{v.label || v || ''}</Hyperlink>
                    </div>;
            })}
        </div> : <div {...rest} className="listbox" aria-expanded={false}></div>);
    return menu;
};