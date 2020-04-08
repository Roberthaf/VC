import React, { Component } from 'react'
import "./SelectionMenu.css"
import { Button } from 'react-bootstrap'
import propTypes from "prop-types";

//Amplify.configure(aws_exports, {});

class SelectionMenu extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // Lice tree desicions
            showSalmonLice: false,
            showSalmon: false,
            showCod: false,
            showAdult:false,
            showPreAdult: false,

            // Comments related to fish health
            showWound: false,
            showDefects: false,
            showFin: false,
            showObservation: false,
            showScaleLoss: false,
            showCataract: false,
            showRedBelly: false,
            ShowMaturation: false,

            // Fish info
            showFemale: false,
            showMale: false,
            showAdultMale: false,
            showAdultFemale: false,
            showWithEggs: false,
            showWithOutEggs: false,
            handleComment: '',
            valueComment: '',

            // State varibales for API POST Calls
            AttributeType_ID: 0,
            LiceAge_ID: 0,
            LiceGender_ID: 0,
            LiceType_ID: 0,
            LiceMobility_ID : 0,
            LiceEggs_ID : 0,
            Color: 'red',

        };
        this.commentChange = this.commentChange.bind(this);
        this.createImageAttribtes = this.createImageAttribtes.bind(this);
        this.cancelMark = this.cancelMark.bind(this);
    };

    commentChange(event){
        this.setState({
            valueComment: event.target.value
        })
    };

    saveButton(){
        /* Render the Savebutton and include the postAPIcall function*/
        
        return( 
            <Button bsstyle="success"  className="saveButton" onClick={this.createImageAttribtes}>Save mark</Button>
        )
    };

    createImageAttribtes = async () => {
        var attributeLength = this.props.imageAttributes.length
        var arrayIndexNumber = this.props.imageAttributes
        var number;

        // if the array is empty we use 1
        if(attributeLength < 1){
            number = 1
        } 
        // If theses two numbers are equal we use the array length + 1
        else if(attributeLength === arrayIndexNumber.slice(-1)[0].Attribute_Index ){
            number = this.props.imageAttributes.length + 1
        } else { // They lengths are unequal an we use the last index used
            number = arrayIndexNumber.slice(-1)[0].Attribute_Index + 1
        }
 
        let newDot = {
            Photo_ID: this.props.imageID,
            PosX : this.props.xCoords,
            PosY : this.props.yCoords,
            AttributeType_ID : this.state.AttributeType_ID,
            Attribute_Index: number,
            Attribute_Details : `'${this.state.Color}'`, 
            Comment : `'${this.state.valueComment}'`, 
            Description : "'None'",
            LiceAge_ID : this.state.LiceAge_ID,
            LiceGender_ID : this.state.LiceGender_ID,
            LiceType_ID : this.state.LiceType_ID,
            LiceMobility_ID : this.state.LiceMobility_ID,
            LiceEggs_ID : this.state.LiceEggs_ID,
            Population_ID: this.props.populationID
          }
        // Call the post Image Attribute API
        this.props.postImageAttribute(newDot);
        
        this.setState({
            // Rest all states to false
            showSalmonLice: false,
            showSalmon: false,
            showCod: false,
            showAdult:false,
            showPreAdult: false,
            showWound: false,
            showDefects: false,
            showScaleLoss: false, 
            showCataract: false,
            showRedBelly: false,
            ShowMaturation: false,
            showFin: false,
            showObservation: false,
            showFemale: false,
            showMale: false,
            showAdultMale: false,
            showAdultFemale: false,
            showWithEggs: false,
            showWithOutEggs: false,

            handleComment: '',
            valueComment: '',

            // Reset all values
            AttributeType_ID: 0,
            LiceAge_ID: 0,
            LiceGender_ID: 0,
            LiceType_ID: 0,
            LiceMobility_ID : 0,
            LiceEggs_ID : 0,
            Color: 'red',
        });
        this.props.SelectionMenuOnOff(false);
        this.props.reDrawImage();

    };

    cancelMark(){
        this.setState({
            // Rest all states to false
            showSalmonLice: false,
            showSalmon: false,
            showCod: false,
            showAdult:false,
            showPreAdult: false,
            showWound: false,
            showDefects: false,
            showFin: false,
            showObservation: false,
            showFemale: false,
            showMale: false,
            showAdultMale: false,
            showAdultFemale: false,
            showWithEggs: false,
            showWithOutEggs: false,
            
            handleComment: '',
            valueComment: '',

            // Reset all values
            AttributeType_ID: 0,
            LiceAge_ID: 0,
            LiceGender_ID: 0,
            LiceType_ID: 0,
            LiceMobility_ID : 0,
            LiceEggs_ID : 0,
            Color: 'red',

            markID: this.state.markID - 1,
        });
        this.props.reDrawImage();
        this.props.SelectionMenuOnOff(false);
    };

    render (){
        let { 
            showSalmonLice, showPreAdult,showAdult, showCod, showMale, showFemale, showAdultFemale, showAdultMale, 
            showWound, showObservation ,showWithEggs, showWithOutEggs, showScaleLoss, showCataract, showRedBelly, ShowMaturation
        } = this.state 
        //showDefect, showFinStatus, showGeneral ,
        /*show or hide tree*/
        var renderTree = 'none';
        if(this.props.showTree === true){
            renderTree = null
        }else if(this.props.showTree === false){
            renderTree = 'none'
        }
        return(
        <div className="selectionMenu" style={{ position: 'absolute', left: this.props.menuX + 40, top: this.props.menuY, display: renderTree }}>
            <p className="SelectionText">Mark Type?</p>
            <ul className="tree_base">
                <li 
                    className={showSalmonLice ? "buttn selected" : "buttn "} 
                    onClick={ () => this.setState({showSalmonLice: !this.state.showSalmonLice, showObservation: false, showCod:false, 
                        LiceType_ID: 1, //Salmon Louse
                        AttributeType_ID: 1, // Salmon louse
                        Color : 'red',
                    }) } >
                    Salmon Louse
                </li>
                    <ul className={ showSalmonLice ? "showDis tier1" : "hideDis tier1"}>   
                        <li 
                            className={showAdult ? "buttn selected" : "buttn "} 
                            onClick={ () => this.setState({showAdult: !this.state.showAdult, showPreAdult: false, 
                                LiceAge_ID: 1, // Adult
                                LiceMobility_ID: 1, // Sessile
                            }) }>
                            Adult
                        </li>
                            <ul className={showAdult ? "showDis tier2 selected" : "hideDis tier2" } >
                                <li                                     
                                    className={showAdultMale ? "buttn selected" : "buttn "} 
                                    onClick={ () => this.setState({showAdultMale: !this.state.showAdultMale, showAdultFemale:false,LiceGender_ID: 1, LiceEggs_ID:3 }) } >
                                    Male
                                </li>
                                    <ul className={showAdultMale ? "showDis tier2 selected" : "hideDis tier2"} >
                                        <div className="adultMaleSaveButton">
                                            {this.saveButton()}
                                        </div>
                                    </ul>
                                <li
                                    className={showAdultFemale ? "buttn selected" : "buttn "} 
                                    onClick={ () => this.setState({showAdultFemale: !this.state.showAdultFemale, showAdultMale:false,LiceGender_ID: 2 }) }>
                                    Female
                                </li>
                                    <ul className={showAdultFemale ?"showDis tier3 selected" : "hideDis tier3" } >
                                        <li 
                                            onClick={ () => this.setState({showWithEggs: !this.state.showWithEggs, showWithOutEggs:false, LiceEggs_ID:1 }) }
                                            className={showWithEggs ? "buttn selected" : "buttn"} >
                                            With Eggs
                                        </li>
                                            <ul className={showWithEggs ? "showDis selected eggs" : "hideDis"}>
                                                {this.saveButton()}
                                            </ul>
                                        <li
                                            onClick={ () => this.setState({showWithOutEggs: !this.state.showWithOutEggs, showWithEggs:false, LiceEggs_ID:2}) }
                                            className={showWithOutEggs ? "buttn selected" : "buttn"}>
                                            Without Eggs
                                        </li>
                                            <ul className={showWithOutEggs ? "showDis selected eggs" : "hideDis"}>
                                                {this.saveButton()}
                                            </ul>
                                    </ul>
                            </ul>
                        <li 
                            className={showPreAdult ? "buttn selected" : "buttn "} 
                            onClick={ () => this.setState({showPreAdult: !this.state.showPreAdult, showAdult: false, 
                                LiceAge_ID: 2, // PreAdult
                                LiceMobility_ID: 2, // Motile
                                LiceEggs_ID: 3, // Male no Eggs
                            }) } >
                            PreAdult
                        </li>
                            <ul className={showPreAdult ? "showDis tier2 selected" : "hideDis tier2"}>
                                <li
                                    className={showMale ? "buttn selected" : "buttn "} 
                                    onClick={ () => this.setState({showMale: !this.state.showMale, showFemale:false, LiceGender_ID: 1}) }>
                                    Male
                                </li>
                                    <ul className={showMale ? "showDis" : "hideDis" } >
                                        <div className="preAdultSavebutton">
                                            {this.saveButton()}
                                        </div>
                                    </ul>

                                <li                                    
                                    className={showFemale ? "buttn selected" : "buttn "} 
                                    onClick={ () => this.setState({showFemale: !this.state.showFemale, showMale:false, 
                                        LiceGender_ID: 2, // Female
                                        LiceEggs_ID: 2, // No Eggs

                                    }) }>
                                    Female
                                </li>

                                <ul className={showFemale ? "showDis" : "hideDis" } >
                                    <div className="preAdultSavebutton">
                                        {this.saveButton()}
                                    </div>
                                </ul>
                            </ul>

                    </ul>
                <li 
                    className={showCod ? "buttn selected" : "buttn "} 
                    onClick={ () => this.setState({
                        showCod: !this.state.showCod, 
                        showSalmonLice:false, 
                        showObservation: false, 
                        AttributeType_ID: 6,
                        LiceType_ID: 2,
                        LiceAge_ID: 3, // No Age
                        LiceGender_ID: 3,
                        LiceMobility_ID: 3,
                        LiceEggs_ID: 4,
                        Color: 'orange',
                    }) }>
                    Cod Louse
                </li>
                    <ul className={showCod ? "showDis tier1" : "hideDis tier1"} >
                        <div className="codLouseSaveButton" >
                            {this.saveButton()}
                        </div>
                    </ul>
                
                <li 
                    className={showObservation ? "buttn selected" : "buttn "} 
                    onClick={ () => this.setState({showSalmonLice: false, showObservation: !this.state.showObservation, showCod:false }) } >
                    Observations
                </li>
                    <ul className={ showObservation ? "showDis tierObs" : "hideDis tierObs"}>
                        <li 
                            className={showWound ? "buttn selected" : "buttn " } 
                            onClick={ () => this.setState({
                                showWound: !this.state.showWound,
                                showScaleLoss: false,
                                showCataract: false,
                                showRedBelly: false,
                                ShowMaturation: false,

                                AttributeType_ID: 2, // Wounds
                                LiceAge_ID: 3,
                                LiceGender_ID: 3,
                                LiceType_ID: 3,
                                LiceMobility_ID: 3,
                                LiceEggs_ID: 4,
                                Color: 'yellow',
                            }) }>
                            Wounds
                        </li>
                            <ul className={ showWound ? "showDis tierObs" : "hideDis tierObs"}>
                                <textarea 
                                    id="WoundField" 
                                    className="CommentField" 
                                    rows="4" cols="20" 
                                    placeholder="Wound Comment"
                                    type="text"
                                    value={this.state.valueComment}
                                    onChange={this.commentChange }
                                >
                                </textarea>
                                <div className="saveButtonWoundContainer">
                                    {this.saveButton()}
                                </div>
                                
                            </ul>
                        
                        <li
                        className={showScaleLoss ? "buttn selected" : "buttn "} 
                        onClick={ () => this.setState({
                            showWound: false,
                            showScaleLoss: !this.state.showScaleLoss,
                            showCataract: false,
                            showRedBelly: false,
                            ShowMaturation: false,

                            AttributeType_ID: 8, //Scale loss
                            LiceType_ID: 3, // other
                            LiceAge_ID: 3, // No Age
                            LiceGender_ID: 3, // Other
                            LiceMobility_ID: 3, // Other
                            LiceEggs_ID: 4,
                            Color: 'red',
                        }) }>
                        
                            Scale Loss
                        </li>
                            <ul className={showScaleLoss ? "showDis tier1" : "hideDis tier1"} >
                                <div className="saveButtonContainer" >
                                    {this.saveButton()}
                                </div>
                            </ul>

                        <li
                        className={showCataract ? "buttn selected" : "buttn "} 
                        onClick={ () => this.setState({
                            showWound: false,
                            showScaleLoss: false,
                            showCataract: !this.state.showCataract,
                            showRedBelly: false,
                            ShowMaturation: false,

                            AttributeType_ID: 9, //
                            LiceType_ID: 3, // other
                            LiceAge_ID: 3, // No Age
                            LiceGender_ID: 3, // Other
                            LiceMobility_ID: 3, // Other
                            LiceEggs_ID: 4,
                            Color: 'red',
                        }) }>
                        
                            Cataract
                        </li>
                            <ul className={showCataract ? "showDis tier1" : "hideDis tier1"} >
                                <div className="saveButtonContainer" >
                                    {this.saveButton()}
                                </div>
                            </ul>

                        <li
                        className={showRedBelly ? "buttn selected" : "buttn "} 
                        onClick={ () => this.setState({
                            showWound: false,
                            showScaleLoss: false,
                            showCataract: false,
                            showRedBelly: !this.state.showRedBelly,
                            ShowMaturation: false,

                            AttributeType_ID: 10, //
                            LiceType_ID: 3, // other
                            LiceAge_ID: 3, // No Age
                            LiceGender_ID: 3, // Other
                            LiceMobility_ID: 3, // Other
                            LiceEggs_ID: 4,
                            Color: 'red',
                        }) }>
                        
                            Red Belly
                        </li>
                        <ul className={showRedBelly ? "showDis tier1" : "hideDis tier1"} >
                            <div className="saveButtonContainer" >
                                {this.saveButton()}
                            </div>
                        </ul>


                        <li
                        className={ShowMaturation ? "buttn selected" : "buttn "} 
                        onClick={ () => this.setState({
                            showWound: false,
                            showScaleLoss: false,
                            showCataract: false,
                            showRedBelly: false,
                            ShowMaturation: !this.state.ShowMaturation,

                            AttributeType_ID: 11, //
                            LiceType_ID: 3, // other
                            LiceAge_ID: 3, // No Age
                            LiceGender_ID: 3, // Other
                            LiceMobility_ID: 3, // Other
                            LiceEggs_ID: 4,
                            Color: 'red',
                        }) }>
                        
                            Maturation
                        </li>
                        <ul className={ShowMaturation ? "showDis tier1" : "hideDis tier1"} >
                            <div className="saveButtonContainer" >
                                {this.saveButton()}
                            </div>
                        </ul>

                    </ul>
            </ul>
            <Button bsstyle="danger" onClick={ this.cancelMark }>Cancel</Button>
        </div>
        )
    };
};
export default SelectionMenu;

propTypes.SelectionMenu = {
    xCoords: propTypes.number,
    yCoords: propTypes.number,
    menuX: propTypes.number,
    menuY: propTypes.number,
    imageID: propTypes.number,
    populationID: propTypes.number,
    SelectionMenuOnOff: propTypes.function,
    reDrawImage: propTypes.function,
};