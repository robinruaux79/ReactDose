import React from 'react';

import { Globalization, Translate } from './Globalization.jsx';
import { Form, TextField, EmailField, NumberField, RadioGroup, RadioField, CheckboxField } from './Field.jsx';

const App = () => {
  return (<>
    <Globalization>
      <Translate id="TEST" />
    </Globalization>

    <Form>
      <TextField />
      <EmailField />
      <NumberField />
      <RadioGroup>
        <RadioField />
        <RadioField />
      </RadioGroup>
      <CheckboxField />
    </Form>
  </>)
}

export default App;