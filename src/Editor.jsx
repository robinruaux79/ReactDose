import React, {useContext, useEffect, useRef} from "react";
import {Hyperlink, Item, Menu} from "./Tags.jsx";
import {Icon} from "./Theme.jsx";

export const HTMLEditor = (props) => {

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

    const Workspace = ({index,children,editable}) => {
        const sectionRef = useRef(null);

        useEffect(() => {
            if( sectionRef && sectionRef.current ){
                sectionRef.current.addEventListener('input', () => {
                    workspaces[index] = sectionRef.current.innerHTML;
                });
            }
        }, [sectionRef.current]);

        let content = children;
        if( workspaces[index] ){
            content = <div dangerouslySetInnerHTML={{__html:workspaces[index]}}></div>;
        }
        return <section ref={sectionRef} key={index} className="workspace" contentEditable={editable}>{content}</section>
    };

    useEffect(() => {
        window.addEventListener('unload', () => {
            console.log(workspaces);
            localStorage.setItem('workspaces', JSON.stringify(workspaces));
        });
    }, []);
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
                <Menu>
                    <Item><Hyperlink onClick={editHTMLNodeFunc}><Icon provider="fa" name="edit" label="Edit HTML" />Edit HTML</Hyperlink></Item>
                    <Item><Hyperlink onClick={copyNodeFunc}><Icon provider="fa" name="copy" label="Copy" /> Copy node</Hyperlink></Item>
                    <Item><Hyperlink onClick={pasteNodeFunc}><Icon provider="fa" name="paste" label="Paste" /> Paste node</Hyperlink></Item>
                    <Item><Hyperlink onClick={deleteNodeFunc}><Icon provider="fa" name="trash" label="Delete" /> Delete node</Hyperlink></Item>
                </Menu>
            </Item>
        </Menu>
        <Workspace editable index={0}>
            <div>Test</div>
        </Workspace>
        <Workspace index={1} />
    </>
};