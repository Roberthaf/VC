import React, { Component } from "react";
import Amplify, { graphqlOperation, API, Analytics } from "aws-amplify";
//, Analytics
import SpotliceNav from "./SpotliceNavigation";
import "./Spotlice.css";
import { getUserOrgs, ImageCount } from "../customGQL/customQueries";
import { CountContainer } from "./countContainer";
import { ImageAttribute,ThumbnailList } from "../customGQL/customQueries";
import { postImageAttribute, deleteImageAttribute, updateImageClassification } from "../customGQL/customMutations";
import propTypes from "prop-types";
import moment from "moment";
import ImageCanvas from "../Spotlice/ImageCanvas/ImageCanvas";
import aws_exports from "../aws-exports";
import ThumbnailContainer from "../Spotlice/Thumbnails/ThumbnailContainer";
import Reports from "./Reports/Report";

Amplify.configure(aws_exports, {});

class Spotlice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        organisations: {
          items: [
            {
              organisation: {
                farms: {
                  items: []
                }
              }
            }
          ]
        }
      },
      countData: [],
      isCountsLoading: false,
      isLoaded: false,
      isUserDataloded: false,
      orgList: [],
      orgIndex: 0,
      startDate: "",
      endDate: "",
      currentOrg: {
        orgID: 9999,
        orgName: "None",
        farms:{
          items:[ 
            {
              farmID: 9999,
              farmName: "None",
               population:
                  {
                    items:[
                      {popName: "None", popID: 9999}
                    ]
                  }
            }
          ]
        }
      },
      date: moment().format("YYYY-MM-DD"),
      spotliceNav:{
        spotliceHome: true,
        spotliceImages: false,
        spotliceReports: false,
        selected_dropdown: false,
      },
      org: [],
      orgID: 0,
      farmID: 0,
      populationID: 0,
      imageID: "",
      imageURL: null,
      imageWeight: 0,
      classification: "",
      ImageAttributeList: [],
      thumbnailList: [],
      isThumbnailLoading: false,
      isThumbnailListLoaded: false,
      message: "",
      isImageClassificationLoading: false,
      // isImageLoading: false,
      // isImageLoaded: false,
    };
    this.handleChangeOrg = this.handleChangeOrg.bind(this);
    this.changeSpotlicePages = this.changeSpotlicePages.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.GetGQLThumbnailList = this.GetGQLThumbnailList.bind(this);
    this.getImageAttribute = this.getImageAttribute.bind(this);
    this.postImageAttributes = this.postImageAttributes.bind(this);
    this.deleteImageAttributes = this.deleteImageAttributes.bind(this);
  };

  componentDidMount(){
    let { isUserDataLoaded,userData } = this.props;
    let {orgIndex} = this.state;
    
    // Record each time Spotlice is accessed
    Analytics.record("Spotlice loaded");

    // Get the current organisation
    this.setState({
      currentOrg: userData.organisations.items[orgIndex].organisation,
      isCountsLoading: true,
    });
    
    //If for somereason no userData is loaded we will send the user back to root and get userData
    if (isUserDataLoaded === false) {
      //history.push("/");
    } else if (isUserDataLoaded === true) {
      // Itterate through all the farms and populations for a single Organisation.
      userData.organisations.items[orgIndex].organisation.farms.items.map(f =>
        f.population.items.map(p => this.listCounts(p.popID, this.state.date))
      );
    }
    // Fetch a simplified list object.
    API.graphql(graphqlOperation(getUserOrgs, { id: this.props.userData.id }))
    .then(response =>
      this.setState({
        orgList: response.data.getUser.organisations.items,    
      })
    );
  };

  componentDidUpdate(prevProps,prevState){
    let { userData } = this.props;
    let { orgIndex } = this.state;
    // Monitor if the organisation index is changing. If so we call again for new imageCounts
    if(prevState.orgIndex !== this.state.orgIndex){
      this.setState({
        countData:[],
        imageURL: null,
      });
      // Itterate through all the farms and populations for a single Organisation.
      userData.organisations.items[orgIndex].organisation.farms.items.map(f =>
        f.population.items.map(p => this.listCounts(p.popID, this.state.date))
      );
    }
  };
  
  changeSpotlicePages(obj){
    this.setState({
      spotliceNav:{
        spotliceHome: obj.spotliceHome ,
        spotliceImages: obj.spotliceImages, 
        spotliceReports: obj.spotliceReports,
        selected_dropdown: obj.selected_dropdown,
      }
    });
  };

  listCounts = (popID, date) => {
    const items = { populationId: popID, startDate: date }
    API.graphql(graphqlOperation(ImageCount, items)).then(response =>
      {
      this.setState({
        countData: [...this.state.countData, response.data.getImageCountList],
        isCountsLoading: false
      });
      }
    );
  };

  GetGQLThumbnailList (PopID, startDate, endDate){
    this.setState({isThumbnailLoading: true})
    const items = { 
      populationId: PopID,
      startDate: startDate,
      endDate: endDate
    }
    API.graphql(graphqlOperation(ThumbnailList, items)).then(
      response => {
        if( response.data.getThumbnailList.length === 0 ){
          this.setState({
            thumbnailList: ["No Images Found"],
            isThumbnailLoading: false,
            isThumbnailListLoaded: true,
            startDate: startDate,
            endDate: endDate
          });
        }else {
          this.setState({
            thumbnailList: response.data.getThumbnailList,
            isThumbnailLoading: false,
            isThumbnailListLoaded: true,
            startDate: startDate,
            endDate: endDate
          })
        }
      }
    )
  };

  handleChangeOrg = event => {
    let { userData } = this.props;
    // Select the organisation. This function is passed to spotlice Nav
    this.setState({
      orgIndex: event,
      currentOrg: userData.organisations.items[event].organisation,
      thumbnailList: [],
      imageURL: null
    });
  };

  handleChangeFarm = event => {
    this.setState({
      farmID: event
    });
  };

  handleChangePopulation = event => {
    var number = parseInt(event, 10);
    this.setState({
      populationID: number
    });
  };

  getImageAttribute(PhotoID){
    const items = {Photo_ID: PhotoID}; 
    // API call to fetch the image counts
    API.graphql(graphqlOperation(ImageAttribute, items)).then(
      response => {
        this.setState({
          ImageAttributeList: response.data.getImageAttribute,
          photoId: PhotoID
        })
    });
  };

  postImageAttributes = async (props) => {
    /* Take in a props obj and use a spread opperator to create the objects we need to use. */
    const items = {...props}
    const response = await API.graphql(graphqlOperation(postImageAttribute, items));
    this.setState({
      message: response.data.postImageAttribute.Response
    });
    this.getImageAttribute(this.state.imageID);
  };

  deleteImageAttributes = async attributeID => {
    let values = JSON.parse(attributeID.target.value);
    const items = { Attribute_ID: values.AttributeID };
    const response = await API.graphql(graphqlOperation(deleteImageAttribute, items));
    this.setState({
      message: response.data.deleteImageAttribute.Response
    });
    this.getImageAttribute(this.state.imageID);
  };

  imageClassification = async (classification) => {
    this.setState({
      isImageClassificationLoading: true,
    })
    let { ImageAttributeList, imageID, populationID, startDate, endDate } = this.state;

    const items = { Photo_ID: this.state.imageID, Classification_ID: classification };
    const response = await API.graphql(graphqlOperation(updateImageClassification, items));
    this.setState({
      message: response.data.updateImageClassification.Response
    });

    // If ImageAttribute list is empty we need to create a new mark.
    if(ImageAttributeList.length === 0 ){
      let newDot = {
        Photo_ID: imageID,
        PosX : 20,
        PosY : 20,
        AttributeType_ID : 7,
        Attribute_Index: 1,
        Attribute_Details : "'green'", 
        Comment : "'No lice'", 
        Description : "'None'",
        LiceAge_ID : 3,
        LiceGender_ID : 3,
        LiceType_ID : 3,
        LiceMobility_ID : 3,
        LiceEggs_ID : 4,
        populationId: populationID 
      };

      this.postImageAttributes(newDot);

      
    }
    this.GetGQLThumbnailList( populationID, startDate, endDate );
    this.setState({
      isImageClassificationLoading: false,
    })
  };
  
  handleChangeDate = (S,E) => {
    this.setState({
      startDate: S,
      endDate: E
    });
  };

  handleChangeImage = props => {
    this.setState({
      imageURL: props
    })
  };

  // A function that handles clikcing on the thumbnail images and selecting a image to load
  handleClick(image_id, imageUrl, index, classification){
    let imgContainer = document.getElementById("thumbnail_items");
    let images = imgContainer.getElementsByClassName("imageItem");
    // Add a class list active to our images, See CSS for class information
    images[index].classList.add("activeItem");

    //Loop throught the images, add and remove classes if image is selected or deselected
    for (let i = 0; i < images.length; i++) {
      images[i].addEventListener("click", function() {

        let current = document.getElementsByClassName("activeItem");
        current[0].className = current[0].className.replace("activeItem", "");
        this.className += " activeItem";
      });
    };
    this.getImageAttribute(image_id);
    this.setState({
      imageID: parseInt(image_id,10),
      imageURL: imageUrl,
      classification: classification,
      message: "",
      imageWeight: this.state.thumbnailList[index].Weight
    });
    
  };
  
  render() {
    let { spotliceNav,currentOrg } = this.state;
    const { userData } = this.props;
    return (
      <div className="spotliceWrapper">
        <SpotliceNav 
          {...this.props}
          isAdmin={userData.admin}
          currentOrg={this.state.currentOrg}
          changeSpotlicePages={this.changeSpotlicePages}
          selectOrg={this.handleChangeOrg}
          spotliceNav={this.state.spotliceNav}
        />
        <div className="spotliceContainer">
        {
          spotliceNav.spotliceHome &&
            <CountContainer
              {...this.props}
              isLoading={this.state.isCountsLoading}
              countData={this.state.countData}
              selectedOrg={currentOrg}
            />
        }
        {
          spotliceNav.spotliceImages &&      
          <div className="imageViewContainer">
            <ThumbnailContainer 
              userData={this.props.userData}
              currentOrg={currentOrg}
              handleClick={this.handleClick}
              handleChangeDate={this.handleChangeDate}
              thumbnailList={this.state.thumbnailList}
              handleChangeImage= {this.handleChangeImage}
              isThumbnailLoading={this.state.isThumbnailLoading}
              isThumbnailListLoaded={this.state.isThumbnailListLoaded}
              handleChangePopulation={this.handleChangePopulation}
              handleChangeFarm={this.handleChangeFarm}
              GetGQLThumbnailList={this.GetGQLThumbnailList}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
            <ImageCanvas 
              imageURL={this.state.imageURL}
              ImageAttributeList={this.state.ImageAttributeList}
              Weight={this.state.imageWeight}
              imageID={this.state.imageID}
              currentOrg={currentOrg}
              populationID={this.state.populationID}
              farmID={this.state.farmID}
              getImageAttribute={this.getImageAttribute}
              postImageAttributes={this.postImageAttributes}
              deleteImageAttributes={this.deleteImageAttributes}
              imageClassification={this.imageClassification}
              isImageClassificationLoading={this.state.isImageClassificationLoading}
            />
          </div>
        }
        {
          spotliceNav.spotliceReports &&
          <div className="reportsContainer">
            <Reports 
              currentOrg={currentOrg}
              
            />
          </div>
        }
        </div>
      </div>
    );
  }
}
export default Spotlice;

propTypes.Spotlice = {
  userList: propTypes.list,
  getUserSub: propTypes.function,
  userData: propTypes.list,
  isUserDataLoaded: propTypes.bool,
};