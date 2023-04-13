import { useContext, createContext } from "react";

const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
  }
}

const locale = getNavigatorLanguage();
const i18nContextValue = {
    locale,
    messages: {
        'fr': {
            'Home': 'Accueil'
        }
    }
};
const GlobalizationContext = createContext({i18nContextValue});
export const Globalization = ({children}) => {
    return (
        <GlobalizationContext.Provider value={i18nContextValue}>
            {children}
        </GlobalizationContext.Provider>);
}

export const Translate = ({id, children}) => {
    const ctx = useContext(GlobalizationContext);
    const messages = ctx.messages[ctx.locale];
    return messages[id] || children;
}

export default Globalization;