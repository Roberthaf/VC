import React from "react";
import { Table, Row, Col } from "react-bootstrap";

const Channels = props => (
  <Row className="Information-tab">
    <Col lg={12}>
      <Table>
        <thead>
          <tr>
            <th>
              <h4 className="inl">Time</h4>
            </th>
            {props.channelNames.map((name, index) => (
              <th key={index}>
                <h4 className="inl">{name}</h4>
              </th>
            ))}
            <th>
              <h4 className="inl">Sum</h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* 
            Stored Value is a 2-dimentional array [Arry1[values], Array2[values2]...  ]
            Itterate over each Arrays then itterate over the values inside and display them in a table
            the values inside of each 
          */}
          {props.storedValues.map((values, index_top) => (
            <tr key={index_top}>
              {props.storedValues[index_top].map((value, index) => (
                <td key={index}>
                  <h4 className="inl">{value.toLocaleString()}</h4>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
);
export default Channels;
