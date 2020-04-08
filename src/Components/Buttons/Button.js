import React from 'react';
import {Button} from 'react-bootstrap';
import './Buttons.css'

export const Buttons = props => {
    return(
    <Button 
        className="buttons"
        {...props}
    >
        {props.text}
    </Button>
    )
}