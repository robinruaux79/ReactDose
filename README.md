# ReactDose
Une bibliothèque de composants React pour vos interfaces web

## Documentation

### Translate
Un composant pour générer des traductions à la volée.

```
<Translate id="Home" lang="fr">Default value</Translate>
```

You must rap ```<Translate />``` components with the ```<Globalization></Globalization>``` high-order component.

### Title
Un composant pour vos titres HTML.

```
<Title level={3}>Titre h3</Title>
```

### TextField
Un composant de saisie de texte (support multiline).

```
<TextField name="user" label="User" value="Robin" placeholder="Rechercher un utilisateur..." help="Un nom, un prénom, un identifiant..." minlength={3} required />
```

### EmailField
Un composant de saisie d'email (fonctionne comme TextField)

```
<EmailField name="email" label="Email" maxlength={80} />
```


### NumberField
Un composant pour saisir un nombre.

```
<NumberField label="Appreciation" name="appreciation" step={1} min={1} max={5} required />
```


### RadioGroup / RadioField
Un composant de sélection parmi les éléments d'un groupe

```
<RadioGroup label="Sélectionnez un type de message" name="messageType" required>
    <RadioField checked label="Support" />
    <RadioField label="Pro" />
    <RadioField label="Other" />
</RadioGroup>
```


