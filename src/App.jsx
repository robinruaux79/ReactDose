import React, {useContext, useRef} from 'react';

import { HTMLEditor } from './Editor.jsx';

import {IconContext, ThemeContext} from './Theme.jsx';
import {Globalization, Translate, useTranslate} from './Globalization.jsx';
import { Form, TextField, EmailField, NumberField, RadioGroup, RadioField, CheckboxField } from './Field.jsx';
import {Button, Item, Menu, Title} from "./Tags.jsx";

import './App.css';

/**
 * ICI !
 *
 * Affiche des événements à proximité
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {

  return (<>
    <Globalization>
      <Title>ICI !</Title>
      <HTMLEditor />
    </Globalization>
  </>)
}

export default App;