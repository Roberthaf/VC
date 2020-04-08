import React from 'react';
import { Button } from 'react-bootstrap';
import './ImageForm.css';
import { LiceAge, LiceEggs, LiceGender, LiceType, AttributeType } from "../Components/LiceAttributeConverter";
import propTypes from "prop-types";

// InageForm is used to create information about the lice, type, gender, etc.
// Data to add is Lice Data. Type and stages of the lice f.x
// Wounds and scale damage, deformatioes, and possible Health information etc

export const ImageForm = props => {
    return (
      <div className="lice-form">
        <div className="MarkingList">

        {
          props.Weight ?
          <div className="imageWeight">
            <h3 className="information_text_no_border">Weight</h3>
            <h4 className="imageWeightFont">{props.Weight} g </h4>
          </div>
          : ""
        }
      
          <h3 className="information_text_no_border">Markings</h3>
          <table>
            <tbody>
              { props.ImageAttributeList.map((mark,index)=>{
                
                let valObj = {
                  AttributeID: mark.Attribute_ID, 
                  PhotoID: mark.Photo_ID 
                }
                // Attribute_ID 1 is lice Salmon or Cod
                if( mark.AttributeType_ID  === 1 ){
                  return (
                    <tr key={index} className="lice_item">
                      { <td>{'# '+ mark.Attribute_Index + '. ' + LiceAge(mark.LiceAge_ID) + ' ' + LiceGender(mark.LiceGender_ID) + ' - ' + LiceEggs(mark.LiceEggs_ID) +' - '+ LiceType(mark.LiceType_ID) + ' Louse'} </td> }
                      
                      <td ><Button 
                        id={`delbutton${index}`}
                        value={JSON.stringify(valObj)}
                        className="delete_mark_button" 
                        bssize="xsmall" bsstyle="danger" 
                        onClick={ props.deleteImageAttributes }
                        > X </Button></td>
                    </tr>
                  )
                } else if( mark.AttributeType_ID  === 6 ){
                  return (
                    <tr key={index} className="lice_item">
                      {<td>{'# '+ mark.Attribute_Index + '. '+ AttributeType(mark.AttributeType_ID )} </td> }
                      
                      <td ><Button 
                        id={`delbutton${index}`}
                        value={JSON.stringify(valObj)}
                        className="delete_mark_button" 
                        bssize="xsmall" bsstyle="danger" 
                        onClick={ props.deleteImageAttributes }
                        > X </Button></td>
                    </tr>
                  )
                } else if( mark.AttributeType_ID  === 7 ){
                  return (
                    <tr key={index} className="lice_item">
                      <td>{'# '+ mark.Attribute_Index + '. No Lice on image'} </td>
                      
                      <td ><Button 
                        id={`delbutton${index}`}
                        value={JSON.stringify(valObj)}
                        className="delete_mark_button" 
                        bssize="xsmall" bsstyle="danger" 
                        onClick={ props.deleteImageAttributes }
                        > X </Button></td>
                    </tr>
                  )
                } 
                else {
                  return (
                    <tr key={index} className="lice_item">
                      { <td>{'# '+ mark.Attribute_Index + '. '+ AttributeType(mark.AttributeType_ID ) +  ' - ' + mark.Comment } </td> }
                      
                      <td ><Button 
                        id={`delbutton${index}`}
                        value={JSON.stringify(valObj)}
                        className="delete_mark_button" 
                        bssize="xsmall" bsstyle="danger" 
                        onClick={ props.deleteImageAttributes }
                        > X </Button></td>
                    </tr>
                  )
                } 
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
export default ImageForm;

propTypes.ImageForm = {
  ImageAttributeList: propTypes.list,
  deleteImageAttributes: propTypes.function,
  isImageClassificationLoading: propTypes.boolen,
  Weight: propTypes.string
};