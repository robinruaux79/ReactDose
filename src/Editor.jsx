import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Hyperlink, Item, Menu} from "./Tags.jsx";
import {Icon} from "./Theme.jsx";
import {Form, TextField} from "./Field.jsx";
import {Translate} from "./Globalization.jsx";

export const HTMLEditor = (props) => {

    const textFieldRef = useRef(null);
    const workspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');

    const newWorkspaceFunc = (e) => {
        e.preventDefault();

    };

    const openWorkspaceFunc = (e) => {

    };

    const shareWorkspaceFunc = (e)=> {

    };

    const editHTMLNodeFunc = (e) => {

    };

    const copyNodeFunc = (e) => {

    };

    const pasteNodeFunc = (e) => {

    };

    const deleteNodeFunc = (e) => {

    };

    const gotoDatabaseFunc = (e) => {

    };

    const runWorkspaceFunc = (e) => {

    };


    const Workspace = ({index,children,editable,showMenu}) => {
        const contentRef = useRef(null);
        const [editMode, setEditMode] = useState(!!editable);

        const editNodeFunc = (e) => {
            setEditMode(!editMode);
            e.preventDefault();

            contentRef.current.focus();
            setCaret(contentRef.current);
        }

        const setCaret = (e) => {
            let range = document.createRange()
            let sel = window.getSelection()
            range.setStart(e, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        useEffect(() => {
            if( contentRef && contentRef.current ){
                contentRef.current.addEventListener('input', () => {
                    workspaces[index] = contentRef.current.innerHTML;
                });
            }
        }, [contentRef.current]);

        useEffect(() => {
            if( editMode ){
                setCaret(contentRef.current);
            }
        }, [editMode])

        let content = children;
        if( workspaces[index] ){
            content = <div dangerouslySetInnerHTML={{__html:workspaces[index]}}></div>;
        }

        /**
         * Composant pour rendre les outils du dev,
         * des listeners de templates
         * des méthodes JS
         * des structures loop, if, constructor...
         * un template HTML emit('onStart'), des événements DOM;
         * des données function/atomic_js_typesn
         *
         *
         */
        return <section key={index} className="workspace">
            <>
                <div className={"workspace-btns"}>
                    <Hyperlink className="workspace-edit-btn" onClick={editNodeFunc}><Icon provider={"fa"} name={"edit"} label={"Edit"} /></Hyperlink>
                    {editMode && (
                        <Hyperlink className={"workspace-del-btn"} onClick={deleteNodeFunc}><Icon provider={"fa"} name={"trash"} label={"Delete"} /></Hyperlink>
                    )}
                </div>
                <div ref={contentRef} className={"workspace-content"} contentEditable={editMode}>
                    {content}
                </div>
            </>
        </section>
    };

    useEffect(() => {
        window.addEventListener('unload', () => {
            localStorage.setItem('workspaces', JSON.stringify(workspaces));
        });
    }, []);

    const [events, setEvents] = useState({});

    const addEventFunc = (e) => {
        if( textFieldRef.current ){
            const input = textFieldRef.current.ref;
            const data = {
                name: input.value,
            };
            if( !events[input.value] ){
                setEvents((ls) => {return {...ls, [input.value]:[data]}});
            }else{
                const l = events[input.value];
                l.push(data);
                setEvents((ls) => {return {...ls, [input.value]:l}});
            }
            input.value = '';
        }
        e.preventDefault();
    };

    const attachListener = (e) => {

    };

    return <>
        <Menu breadcrumb navigation orientation="horizontal">
            <Item>
                <Menu>
                    <Item><Hyperlink onClick={newWorkspaceFunc}><Icon provider="fa" name="file" label="New workspace" /> New workspace</Hyperlink></Item>
                    <Item><Hyperlink onClick={openWorkspaceFunc}><Icon provider="fa" name="folder-open" label="Open workspace" /> Open workspace...</Hyperlink></Item>
                    <Item><Hyperlink onClick={shareWorkspaceFunc}><Icon provider="fa" name="share" label="Share" /> Share with...</Hyperlink></Item>
                </Menu>
            </Item>
            <Item>
            </Item>
        </Menu>
        <Workspace index={0}>
            <div>Test</div>
            <ul>
                <li>Test sur deux lignes</li>
                <li>Test sur deux lignes</li>
            </ul>
        </Workspace>
        <Workspace editable index={1}>
            <div>Ok</div>
        </Workspace>
        <Form onValidate={addEventFunc}>
            <TextField ref={textFieldRef} name={"event"} label={<Translate id={"Events"}>Evénement</Translate>} placeholder={"onStart, onDestroy..."} />
            <Button name={"eventAdd"}><Translate id={"Add"}>Ajouter</Translate></Button>
        </Form>
        {Object.keys(events).map((l,i) => {
            const listeners = events[l];
            return listeners.map((listener, j) => {
                return <Button name={"eventListener"+i} onClick={(e) => attachListener(i, j)}>{listener.name}</Button>;
            });
        })}
    </>
};