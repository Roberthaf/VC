import React from 'react';

/*
  A stateless Component that handles creating Create/Edit/Delete User/Org/Farm/Pop
*/
export const CED = props => (
  <div className="adminview-selecting box-shadow"
    onClick={props.onClick}
  >
  <h5><i className={`fa ${props.font}`} />{" "} {props.text}</h5>
</div>
);  