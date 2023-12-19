import React from 'react';

import {SearchBox} from './Widgets.jsx';

import {Globalization} from './Globalization.jsx';
import {DataEditor, DataTable, Title} from "./Tags.jsx";

import './App.css';

/**
 * ICI !
 *
 * Affiche des événements à proximité
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {

    const searchPropositions = [
        {label: 'Test'}, {label: 'voiture'}, {label: 'camion'}, {label: 'camionnette'}, {label: 'label'}, {label: 'Test'}, {label: 'Test'},
        {label: 'Test 2', description: '', value: 1}
    ];
    return (<>
        <Globalization>
            <Title>ICI !</Title>
            <SearchBox values={searchPropositions}
                       filter={(text, v) => v.label.indexOf(text) !== -1 || v.value === parseInt(text, 10)}
                       sort={(v1, v2) => {
                           return v1.label.localeCompare(v2.label);
                       }} onSelect={(v) => {
                if (v.onSelect)
                    v.onSelect(v);
            }}/>
            <DataEditor datas={{
                "test": "val1",
                "test2": {
                    "test3": null,
                    "test4": 0.5
                },
                "toto": [1, 2]
            }}
            />
            <DataTable showHeader={true} showFooter={true} page={1} elementsPerPage={2}
                       datas={[{id: 'test', name: 'ok'},
                           {id: 'test', name: 'ok2'}, {id: 'test', name: 'ok2'}
                       ]}/>
        </Globalization>
    </>)
}

export default App;