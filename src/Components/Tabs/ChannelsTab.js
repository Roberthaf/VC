import React from "react";
import { Table, Row, Col } from "react-bootstrap";
/*
Test to see if props contain singular information or multiple information e.g wellboats.
props.data vs props.data.data1,2,3 f.x
*/
const Channels = props => (
  <Row className="Information-tab">
    <Col>
      <Table>
        <thead>
          <tr>
            <th>
              <h4 className="inl">Channel #</h4>
            </th>
            {props.channelName.map((name, index) => (
              <th key={index}>
                <h4 className="inl">{name}</h4>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <h4 className="inl">Count</h4>
            </td>
            {props.channelCounts.map((values, index) => (
              <td key={index}>
                <h4 className="inl">{parseInt(values, 10).toLocaleString()}</h4>
              </td>
            ))}
          </tr>
          <tr>
            <td>
              <h4 className="inl">Estimated Size</h4>
            </td>
            {props.estimatedSize.map((esize, index) => (
              <td key={index}>
                <h4 className="inl">{esize}</h4>
              </td>
            ))}
          </tr>
          <tr>
            <td>
              <h4 className="inl">Size Settings</h4>
            </td>
            {props.sizeGroupValues.map((zsize, index) => (
              <td key={index}>
                <h4 className="inl">{zsize} g</h4>
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Col>
  </Row>
);
export default Channels;
