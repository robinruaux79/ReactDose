import React, {useEffect, useRef, useState} from "react";
import {clamp, data_filter, data_paginate} from "./Utils.jsx";

import cn from 'classnames';

import {faBars, faCaretDown, faCaretRight, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ValueEditor} from "./LoopEditor.jsx";
import {NumberField, TextField} from "./Field.jsx";

export const Title = ({children, level, editable}) => {
    const mLevel = clamp(level ? level : 1, 2, 6);
    if (mLevel === 1)
        return <h1 contentEditable={editable}>{children}</h1>;
    if (mLevel === 2)
        return <h2 contentEditable={editable}>{children}</h2>;
    if (mLevel === 3)
        return <h3 contentEditable={editable}>{children}</h3>;
    if (mLevel === 4)
        return <h4 contentEditable={editable}>{children}</h4>;
    if (mLevel === 5)
        return <h5 contentEditable={editable}>{children}</h5>;
    return <h6 contentEditable={editable}>{children}</h6>;
}

export const Time = ({value, locale, options, editable}) => {
    const mOptions = options || {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return <time contentEditable={editable}
                 dateTime={value}>{value.toLocaleDateString(locale ? locale : 'fr-FR', mOptions)}</time>;
};

export const Article = ({
                            title,
                            type,
                            image,
                            tags,
                            publisher,
                            children,
                            editable,
                            created_at,
                            updated_at,
                            mainOnPage,
                            onEdit
                        }) => {
    const ctx = {
        "@context": "https://schema.org",
        "@type": type || "Article",
        "headline": title || "Headline",
        "image": image || '',
        "author": publisher?.name || "ReactDose",
        "genre": "",
        "keywords": (tags || []).join(" ") || '',
        "publisher": {
            "@type": publisher?.type || 'Person',
            "name": publisher?.name || 'ReactDose',
            "logo": {
                "@type": "ImageObject",
                "url": publisher?.logoUrl || ''
            }
        },
        "url": window.location.href,
        "mainEntityOfPage": mainOnPage ? {
            "@type": "WebPage",
            "@id": "https://google.com/article"
        } : null,
        "datePublished": created_at,
        "dateCreated": created_at,
        "dateModified": updated_at,
    };
    return (<article contentEditable={false}>
        {(title || created_at || updated_at) && (
            <header>
                {title && (<Title editable={editable}>{title}</Title>)}
                <span className="created_at">{created_at && (<>publié le <Time editable={editable} locale="fr"
                                                                               value={created_at}>{created_at}</Time></>)}</span>
                <span className="updated_at">{updated_at && (<>mis à jour le <Time editable={editable} locale="fr"
                                                                                   value={updated_at}>{updated_at}</Time></>)}</span>
            </header>
        )}
        <div className="content" contentEditable={editable}>
            {children}
        </div>
        <div className="tags">
            {tags?.map((t, k) => <Hyperlink editable={editable} key={k} target={`/tag/${t}`}>{t}</Hyperlink>)}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `${JSON.stringify(ctx)}`}}></script>
    </article>);
};

export const Button = ({onClick, children, link, editable, name, ...rest}) => {
    const mLink = link || '#';
    const gotoLink = (e) => {
        if (editable) {
            e.preventDefault();
            return;
        }
        if (onClick) {
            onClick(e);
            e.preventDefault();
            return;
        }
        if (mLink[0] === '/' || mLink[0] === '?' || mLink[0] === '#') {
            window.history.pushState({}, e.target.innerText, mLink);
            e.preventDefault();
        } else {
            window.open(mLink, "_blank", "noopener");
        }
    };
    return <button contentEditable={editable} name={name} onClick={gotoLink} {...rest}>{children}</button>
}

export const Hyperlink = ({children, target, editable, onClick, ...otherProps}) => {
    const mTarget = target || '#';
    const handleClick = (e) => {
        const href = e.target.getAttribute('href');
        if (editable) {
            e.preventDefault();
            return;
        }
        if (onClick) {
            onClick(e);
            e.preventDefault();
            return;
        }
        if (href[0] === '/' || href[0] === '?' || href[0] === '#') {
            window.history.pushState({}, e.target.innerText, href);
            e.preventDefault();
        } else {
            window.open(href, "_blank", "noopener");
        }
    };
    return <a contentEditable={editable} onClick={handleClick} href={mTarget} {...otherProps}>{children}</a>
}

export const Menu = ({id, children, ordered, breadcrumb, navigation, editable, orientation, ...otherProps}) => {
    const mOrientation = orientation || 'vertical';
    const className = cn({
        'grid': mOrientation === 'grid',
        'vertical': mOrientation === 'vertical',
        'horizontal': mOrientation === 'horizontal'
    });
    if (navigation) {
        return (ordered ? <ol {...otherProps} className={className} contentEditable={editable}>{children}</ol> :
            <ul {...otherProps} className={className} contentEditable={editable}>{children}</ul>);
    }
    return (ordered ? <ol {...otherProps} id={id} className={className} contentEditable={editable}>{children}</ol> :
        <ul {...otherProps} id={id} className={className} contentEditable={editable}>{children}</ul>);
}

export const Page = ({children}) => {
    return <section class="page">{children}</section>;
}

export const Item = ({children, key}) => {
    return <li key={key}>{children}</li>;
}

export const DataEditor = ({datas, onChange}) => {

    const DataProp = ({path, k, v, onChange}) => {
        let fieldRef = useRef();
        const [menuExpanded, setMenuExpanded] = useState(false);
        const toggleMenu = () => {
            setMenuExpanded(!menuExpanded);
        };
        const [expanded, setExpanded] = useState(true);

        const [value, setValue] = useState(v);
        const setToFalse = (v) => {
            setValue(false);
            setMenuExpanded(false);
        }
        const setToTrue = (v) => {
            setValue(true);
            setMenuExpanded(false);
        }
        const setToNull = (v) => {
            setValue(null);
            setMenuExpanded(false);
        }
        const setToNumber = (v) => {
            setValue(0.0);
            setMenuExpanded(false);
            setFocus();
        }
        const setToText = (v) => {
            setValue('');
            setMenuExpanded(false);
            setFocus();
        }

        const setToArray = (v) => {
            setValue([]);
            setMenuExpanded(false);
        }

        const setFocus = () => {
            setTimeout(() => {
                fieldRef?.current?.ref?.focus();
            }, 50);
        };

        const addValue = () => {
            const v = JSON.parse(JSON.stringify(value));
            v.push(v.length ? v[v.length - 1] : '');
            setValue(v);
        };

        const removeKey = () => {
            if (onChange) {
                onChange(path, value);
            }
        };

        console.log("path,", path);
        return <>
            <div className="dataprop">
                <div className="dataprop-name">{k}</div>
                <div className="dataprop-value">
                    {typeof (value) === 'object' && value !== null && <Hyperlink onClick={() => {
                        setExpanded(!expanded);
                    }}>
                        <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight}/>
                    </Hyperlink>}
                    {(expanded && (typeof (value) === 'object' && value !== null) && (
                        <>
                            <Hyperlink onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></Hyperlink>
                            {Array.isArray(value) && <>Array</>}
                            {Object.keys(value || {}).map(m => {
                                return <DataProp path={[...path, m]} k={m} v={value[m]} onChange={onChange}/>
                            })}
                        </>
                    )) || (expanded && (
                        <div className="dataprop-field">
                            <ValueEditor ref={fieldRef} value={value} onChange={(v) => {
                                setValue(v.target.value);
                                if (onChange) {
                                    onChange(path, v.target.value);
                                }
                            }}/>
                            <Hyperlink onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></Hyperlink>
                            <Hyperlink onClick={removeKey}><FontAwesomeIcon icon={faTrash}/></Hyperlink>
                        </div>
                    ))}
                    {menuExpanded && (
                        <Menu orientation="vertical">
                            {Array.isArray(value) && (
                                <Item><Hyperlink onClick={addValue}>nouvelle valeur</Hyperlink></Item>)}
                            <Item><Hyperlink onClick={setToFalse}>false</Hyperlink></Item>
                            <Item><Hyperlink onClick={setToTrue}>true</Hyperlink></Item>
                            <Item><Hyperlink onClick={setToNull}>null</Hyperlink></Item>
                            <Item><Hyperlink onClick={setToNumber}>number</Hyperlink></Item>
                            <Item><Hyperlink onClick={setToText}>text</Hyperlink></Item>
                            <Item><Hyperlink onClick={setToArray}>array</Hyperlink></Item>
                        </Menu>
                    )}
                </div>
            </div>
        </>;
    }
    return <div className="dataeditor">{Object.keys(datas || {}).map(m => <DataProp onChange={(path, v) => {
        updateJsonAtPath(datas, path, v);
    }
    } k={m} v={datas[m]} path={[]}/>)}</div>;
};

export const updateJsonAtPath = (json, path, value) => {
    let i = 0;
    let n = json;
    let nf = n;
    let p = '';
    while (i < path.length) {
        p = path[i];
        if (n[p])
            n = n[p];
        else
            n[p] = value;
        ++i;
    }
    return nf;
};

export const DataTable = ({datas, showHeader, showFooter, elementsPerPage, page, sort, filter}) => {

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(page);

    const d = data_filter(datas, filter, sort, search);
    const [filteredDatas, setFilteredDatas] = useState(data_paginate(d, currentPage, elementsPerPage));

    useEffect(() => {
        setFilteredDatas(data_paginate(data_filter(datas, filter, sort, search.toLowerCase()), currentPage, elementsPerPage));
    }, [currentPage, search]);

    // Get headers
    let concatH = [];
    datas.forEach(v => {
        concatH = concatH.concat(Object.keys(v));
    });
    concatH = [...new Set(concatH)];

    const datasHeaders = concatH.map(h => {
        return <th key={'h_' + h} scope="col">{h}</th>;
    });

    let datasBody = [];
    Object.values(filteredDatas).forEach((d, i) => {
        datasBody.push(<tr key={'b' + i}>{Object.keys(d).map(k => {
            return <td key={i + '_' + k} headers={k}>{d[k]}</td>
        })}</tr>);
    });

    const gotoPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const gotoNext = () => {
        if (currentPage < pages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const gotoPage = (e) => {
        const p = parseInt(e.target.value, 10);
        if (p > 0 && p <= pages)
            setCurrentPage(p);
    }

    let pagination = [];
    const pages = Math.ceil(d.length / elementsPerPage);
    pagination.push(<><Button disabled={currentPage === 1} onClick={() => gotoPrevious()}>&lt;</Button></>);
    pagination.push(<><NumberField onChange={gotoPage}
                                   value={currentPage}/> / {pages}</>);
    pagination.push(<><Button disabled={currentPage === pages} onClick={gotoNext}>&gt;</Button></>);

    return <table>
        <thead>
        <tr>
            <td colSpan={datasHeaders.length}>
                <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."/>
            </td>
        </tr>
        {datasHeaders.length && (
            <tr>
                {datasHeaders}
            </tr>
        )}
        </thead>
        <tbody>
        {datasBody.length > 0 && (
            <>{datasBody}</>
        )}
        {datasBody.length === 0 && (
            <tr>
                <td colSpan={datasHeaders.length}>Pas de résultats</td>
            </tr>
        )}
        </tbody>
        {showFooter && datasHeaders.length > 0 && (
            <tfoot>
            <tr>
                <td colSpan={datasHeaders.length}>
                    <div className="pagination">{pagination}</div>
                </td>
            </tr>
            </tfoot>
        )}
    </table>
};

DataTable.defaultProps = {
    page: 1,
    elementsPerPage: 20
};
