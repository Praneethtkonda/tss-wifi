import React from 'react';

const Dropdown = (props) => {
    const style = {
        padding: '5px',
        marginBottom: '5px'
    };
    const divStyle = {
        textAlign: 'center'
    };
    const items = props.items.map((el) => (<option value={el} key={el}>{el}</option>))
    return (
        <div style={divStyle}>
            <select style={style} onChange={props.changeHandler}>
                {items}
            </select>
        </div>
    );
};

export default Dropdown;