import React, { isValidElement, Children, cloneElement, useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import uniqid from 'uniqid';
import { useRefs, clamp } from "./Utils.jsx";

import cn from 'classnames';
export const Title = ({ children, level, editable}) => {
    const mLevel = clamp(level ? level : 1, 2, 6);
    if( mLevel == 1)
        return <h1 contentEditable={editable}>{children}</h1>;
    if( mLevel == 2)
        return <h2 contentEditable={editable}>{children}</h2>;
    if( mLevel == 3)
        return <h3 contentEditable={editable}>{children}</h3>;
    if( mLevel == 4)
        return <h4 contentEditable={editable}>{children}</h4>;
    if( mLevel == 5)
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
return <time contentEditable={editable} dateTime={value}>{value.toLocaleDateString(locale ? locale: 'fr-FR', mOptions)}</time>;
};

export const Article = ({ title, type, image, tags, publisher, children, editable, created_at, updated_at, mainOnPage, onEdit }) => {
    const ctx = { "@context": "https://schema.org",
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
            {(title || created_at || updated_at ) && (
                <header>
                    {title && (<Title editable={editable}>{title}</Title>)}
                    <span className="created_at">{created_at && (<>publié le <DateLabel editable={editable} locale="fr" value={created_at}>{created_at}</DateLabel></>)}</span>
                    <span className="updated_at">{updated_at && (<>mis à jour le <DateLabel editable={editable} locale="fr" value={updated_at}>{updated_at}</DateLabel></>)}</span>
                </header>
            )}
            <div className="content" contentEditable={editable}>
                {children}
            </div>
            <div className="tags">
            {tags?.map((t,k) => <Hyperlink editable={editable} key={k} target={`/tag/${t}`}>{t}</Hyperlink>)}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: `${JSON.stringify(ctx)}`}}></script>
        </article>);
};

export const Button = ({ onClick, children, link, editable, name }) => {
    const mLink = link || '#';
    const gotoLink = (e) => {
        if (editable){
            e.preventDefault();
            return;
        }
        if( onClick ){
            onClick(e);
            e.preventDefault();
            return;
        }
        if( mLink[0] == '/' || mLink[0] == '?' ){
            window.history.pushState({}, e.target.innerText, href);
            e.preventDefault();
            return;
        }
    };
    return <button contentEditable={editable} name={name} onClick={gotoLink}>{children}</button>
}

export const Hyperlink = ({ children, target, editable, onClick }) => {
    const mTarget = target || '#';
    const handleClick = (e) => {
        const href = e.target.getAttribute('href');
        if( editable ){
            e.preventDefault();
            return;
        }
        if( onClick ){
            onClick(e);
            e.preventDefault();
            return;
        }
        if( href[0] === '/' || href[0] === '?' ){
            window.history.pushState({}, e.target.innerText, href);
            e.preventDefault();
        }
    };
    return <a contentEditable={editable} onClick={handleClick} href={mTarget}>{children}</a>
}

export const Menu = ({children, ordered, breadcrumb, navigation, editable, orientation}) => {
    const mOrientation = orientation || 'vertical';
    const className = cn({
        'grid': mOrientation === 'grid',
        'vertical': mOrientation === 'vertical',
        'horizontal' : mOrientation === 'horizontal' });
    const content = ( ordered ? <ol className={className} contentEditable={editable}>{children}</ol> : <ul className={className} contentEditable={editable}>{children}</ul>);
    if( navigation ){
        return <nav role="navigation">{content}</nav>;
    }
    return content;
}

export const Page = ({children}) => {
    return <section class="page">{children}</section>;
}

export const Item = ({children, key}) => {
    return <li key={key}>{children}</li>;
}

