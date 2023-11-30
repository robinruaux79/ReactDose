import {TextField} from "./Field";
import {Hyperlink} from "./Tags";

export const SearchBox = (values, value, ...rest) => {
    const selectListItem = () => {

    };

    const filteredValues = values.filter(v=> v.value.toLowerCase().includes(value.toLowerCase()));
    const menu = (filteredValues.length ? <div className="searchbox-list">{filteredValues.map(v => {
        return <div className="searchbox-list-item"><Hyperlink onClick={selectListItem} className="link-overall" />{v}</div>;
    })}</div> : <></>);
    return <TextField {...rest} /> + menu;
}