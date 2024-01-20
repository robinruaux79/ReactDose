import {Children, cloneElement, isValidElement, useCallback, useRef} from "react";

const useRefs = () => {
    const refs = useRef({});

    const register = useCallback((refname) => ref => {
        refs.current[refname] = ref;
    }, []);

    return [refs, register];
}

export {useRefs};

const formatHtml = (text) => {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

export {formatHtml};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export {clamp};


export const data_paginate = (datas, page, elementsPerPage) => {
    if (elementsPerPage && page)
        return datas.slice((page - 1) * elementsPerPage, page * elementsPerPage);
    return datas;
}
export const data_filter = (datas, filter, query) => {
    // Filter data
    let filteredDatas = datas;
    if (filter) {
        filteredDatas = filteredDatas.filter(filter);
    }
    if (typeof (query) === 'string') {
        filteredDatas = filteredDatas.filter(f => {
            let inc = false;
            let keys = Object.keys(f);
            for (let i = 0; i < keys.length; ++i) {
                if (typeof (f[keys[i]]) === 'object')
                    continue;
                if ((f[keys[i]] + '').includes(query)) {
                    inc = true;
                    break;
                }
            }
            return inc;
        })
    }
    return filteredDatas;
}
const sortHeaders = (a, b, columns, columnValues) => {
    if (columns.length === 0) {
        return a < b;
    }
    const [item, ...others] = columns;
    const [column, orderBy] = item;
    const valueA = columnValues ? columnValues(column, a[column]) : (a[column] ?? '');
    const valueB = columnValues ? columnValues(column, b[column]) : (b[column] ?? '');

    if (typeof (valueA) === 'string') {
        return valueA.localeCompare(valueB);
    }

    if (orderBy === 'ASC') {
        if (valueA > valueB) return 1;
        if (valueA < valueB) return -1;
        if (others.length) return sortHeaders(a, b, others, columnValues);
        return 0;
    } else {
        if (valueB > valueA) return 1;
        if (valueB < valueA) return -1;
        if (others.length) return sortHeaders(a, b, others, columnValues);
        return 0;
    }
}

export const data_sort = (datas, column, orderAsc) => {
    const headerSortConf = [[column, orderAsc]];
    return datas.sort((a, b) => sortHeaders(a, b, headerSortConf, null));
}

const recursiveMap = (children, fn) => {
    return Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
            return child;
        }

        if (child.props.children) {
            child = cloneElement(child, {
                children: recursiveMap(child.props.children, fn)
            });
        }

        return fn(child, index);
    });
}
export {recursiveMap};