import React, { Component } from "react";
import Amplify, { API } from "aws-amplify"; 
//import { ImageAttribute,ThumbnailList } from "../customGQL/customQueries";
//import { postImageAttribute, deleteImageAttribute, updateImageClassification } from "../customGQL/customMutations";
import "./Spotlice.css";
import ThumbnailContainer from "../Spotlice/Thumbnails/ThumbnailContainer";
import propTypes from "prop-types";
import ImageCanvas from "./ImageCanvas/ImageCanvas";
import aws_exports from "../aws-exports";

Amplify.configure(aws_exports, {});

/*
  Spotlice er "tengt" af vissuleiti. Verkefnið er búið að vera stopp í 1.5 ár og það sér
  ekki framm á að það verði eitthvað úr þessu aftur með komu Falcon
  Það sem á eftir að gera í að endurtengja t.d. updateImageClassification og fleyra þetta 
 */
class Spotlice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrg: { label: "Vaki", value: 6 },
      organizationList: [{ label: "Vaki", value: 6 }],
      thumbnailList: [],
      ImageAttributeList: [],
      imageID: "",
      imageURL: "",
      classification: "",
      message: "",
      imageWeight: "",
      currentOrg: {
        orgID: 6,
        orgName: "None",
        farms:{
          items:[ 
            {
              farmID: 6,
              farmName: "None",
               population:
                  {
                    items:[
                      {popName: "None", popID: 2910}
                    ]
                  }
            }
          ]
        }
      },
      populationID: 2910,
      isImageClassificationLoading: false,
      
    };
  }

  componentDidMount() {
    //this.fetchThumbnailList();
  }

  handleChangeDate = (start, end) => {
    this.setState({
      startDate: start,
      endDate: end
    });
  };

  handleChangeImage = props => {
    this.setState({
      imageURL: props
    });
  };

  handleChangeFarm = event => {
    this.setState({
      farmID: event
    });
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

  handleChangePopulation = event => {
    var number = parseInt(event, 10);
    this.setState({
      populationID: number
    });
  };

  getImageAttribute = PhotoID => {
    //const items = {Photo_ID: PhotoID};
    let apiName = "vakicloudRdsAPI";
    let path = "/spotlice/getImageAttribute";
    let myInit = {
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        photo_ID: PhotoID
      }
    };
    API.get(apiName, path, myInit).then(response => {
      this.setState({
        ImageAttributeList: response,
        photoId: PhotoID
      });
    });
  };

  updateImageClassification = (Photo_ID, Classification_ID) => {
    let apiName = "vakicloudRdsAPI";
    let path = "/spotlice/getImageAttribute";
    let myInit = {
      response: false,
      queryStringParameters:{
        Photo_ID: Photo_ID,
        Classification_ID: Classification_ID
      },
      body:{
        Photo_ID: Photo_ID,
        Classification_ID: Classification_ID
      }
    };
    API.post(apiName, path, myInit).then(response => {
      console.log(response)
    });
  }

  // A function that handles clikcing on the thumbnail images and selecting a image to load
  handleClick = (image_id, imageUrl, index, classification) => {
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
      imageID: parseInt(image_id, 10),
      imageURL: imageUrl,
      classification: classification,
      message: "",
      imageWeight: this.state.thumbnailList[index].Weight
    });
  };

  changeOrgListValue = event => {};

  postImageAttributes = myProps => {
    let apiName = "vakicloudRdsAPI";
    let path = "/spotlice/postImageAttribute";
    let myInit = {
      headers: {}, 
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        ...myProps
      },
      body:{
        ...myProps
      }
    };

    API.post(apiName, path, myInit).then(response => {
      this.setState({
        message: response
      });
    });
      this.getImageAttribute(this.state.imageID);
  };
  
  deleteImageAttributes = async attributeID => {
    let values = JSON.parse(attributeID.target.value);

    let apiName = "vakicloudRdsAPI";
    let path = "/spotlice/deleteAttribute";
    let myInit = {
      headers: {}, 
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        Attribute_ID: values.AttributeID
      },
      body:{
       Attribute_ID: values.AttributeID
      }
    };
    
    API.post(apiName, path, myInit).then(response => {
      this.setState({
        message: response
      });
    });
    this.getImageAttribute(this.state.imageID);
  };

  fetchThumbnailList = (populationID, startDate, endDate) => {
    let apiName = "vakicloudRdsAPI";
    let path = "/spotlice/thumbnailList";
    
    let myInit = {
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        startDate: "2018-12-05",
        endDate: "2018-12-05",
        population_ID: "2910"
      }
    };
    
    API.get(apiName, path, myInit).then(response => 
      {
        if( response.length === 0 ){
          this.setState({
            thumbnailList: ["No Images Found"],
            isThumbnailLoading: false,
            isThumbnailListLoaded: true,
            startDate: startDate,
            endDate: endDate
          });
        } else {
          this.setState({
            thumbnailList: response,
            isThumbnailLoading: false,
            isThumbnailListLoaded: true,
            startDate: startDate,
            endDate: endDate
          });
        }
      })
    
  };


  render() {
    let { ImageAttributeList, imageURL, currentOrg, populationID } = this.state;
    //selectedOrg, //organizationList,thumbnailList
    // Currently organisation is fixed
    return (
      <div className="spotlice-container default-margin">
        <div>
          <h5 className="gray-text"> Select Organization </h5>

          {/* <button onClick={this.postImageAttributes}>Post Attributtes </button> */}
          <div id="thumbnail_items">
            {/* <span className="Image_count"> Number of images: {listLenght} </span> */}

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
                  fetchThumbnailList={this.fetchThumbnailList}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
              />

              <ImageCanvas
                imageURL={imageURL}
                ImageAttributeList={ImageAttributeList}
                Weight={this.state.imageWeight}
                imageID={this.state.imageID}
                currentOrg={currentOrg}
                populationID={populationID}
                farmID={this.state.farmID}
                getImageAttribute={this.getImageAttribute}
                postImageAttributes={this.postImageAttributes}
                deleteImageAttributes={this.deleteImageAttributes}
                imageClassification={this.imageClassification}
                isImageClassificationLoading={this.state.isImageClassificationLoading}
              />
            </div>
          </div>
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
  isUserDataLoaded: propTypes.bool
};
