import React from "react";
import "./ImageCanvas.css";
import { Spinner } from "../Components/LargeSpinner";
import ImageForm from './ImageForm'
import SelectionMenu from "./SelectionMenu";
import ImageEffect from "./ImageEffects";
import propTypes from "prop-types";
import { Tabs, Tab } from "react-bootstrap";
import { ButtonSpinner } from "../Components/Button_spinner";

class ImageCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasPositionTop: 0, 
      // Image loading states
      isImageLoading: false,
      isImageLoaded: false,
      // Minumum height for our canvas
      width: 1190,
      height: 580,
      // Canvas cordinates
      sx: 0, // The x coordinate where to start clipping
      sy: 0, // The y coordinate where to start clipping
      swidth: 0, // The width of the orginal image
      sheight: 0, // The height of the original image
      x: 0, //The x coordinate where to place the image on the canvas
      y: 0, //The y coordinate where to place the image on the canvas
      xCoords: 0,
      yCoords: 0,
      menuX: 0,
      menuY: 0,
      zoomWindowPosY: 605, // The initial height of the canvas
      show_menu: false, // The selection menu, or selection tree
      // Image Attributes
      weight: 0,
      key: 1
    };

    this.imageZoom = this.imageZoom.bind(this);
    this.loadMarks = this.loadMarks.bind(this);
  };

  componentDidUpdate(prevProps, prevState) {
    // If we load a new url we need to draw a new image and loading states accordingly
    if(prevProps.currentOrg !== this.props.currentOrg){
      this.setState({
        isImageLoading: false,
        isImageLoaded: false
      });
    }
    // If the user changees the url of the image ww change the load indicators.
    // Unless the url is null, e.g. no image found we stop isImageLoading.
    if(prevProps.imageURL !== this.props.imageURL){
      if(this.props.imageURL === null){
        this.setState({
          isImageLoading: false,
          isImageLoaded: false
        });
      }else{
        this.setState({
          isImageLoading: true,
          isImageLoaded: false
        });
      }
      this.drawImage();
    };

    if(prevProps.imageURL === this.props.imageURL){
      //Image url Is not changing but we just added a image Attrribute(marked an image). We reDraw the Image
      if(prevProps.ImageAttributeList !== this.props.ImageAttributeList){
        this.reDrawImage();
      };
    };    
  };

  drawCircle = (x, y) => {
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  };

  drawImage  = async () => {
    let { sx, sy, x, y } = this.state;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    ctx.canvas.width = window.innerWidth * 0.62;
    let zoomWindowPosY = canvas.getBoundingClientRect().top + window.pageYOffset;
    img.src = `${this.props.imageURL}`;
    ctx.canvas.height = ctx.canvas.width * (img.height / img.width);

    img.onload = () => {
      ctx.canvas.height = ctx.canvas.width * (img.height / img.width);
      ctx.drawImage(img,sx,sy,img.width,img.height,x,y,ctx.canvas.width,ctx.canvas.height);
  
      this.setState({
        isImageLoading: false,
        isImageLoaded: true,
        sx: 0,
        sy: 0,
        swidth: img.width,
        sheight: img.height,
        x: 0,
        y: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        zoomWindowPosY: zoomWindowPosY
      });
      this.loadMarks();
    };
  };

  reDrawImage = async () => {
    // We will need to redraw the image. Without showing the user loading.
    // We will invoke this function when the thumbnail list is update but the imageID stays the same
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    let img = new Image();
    img.src = `${this.props.imageURL}`;
    let {sx, sy, swidth, sheight, x, y, width, height} = this.state;

    ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    if(this.props.imageURL === null){
      this.setState({
        isImageLoaded: true,
        isImageLoading: false
    });
   } 
    this.loadMarks();
  };

  loadMarks(){
    // A Function that will load the marks allready on the Image
    let { ImageAttributeList } = this.props;
    let c=document.getElementById("canvas")
    let ctx=c.getContext("2d");
    ImageAttributeList.forEach( (element) => {
      ctx.beginPath();
      ctx.strokeStyle = element.Attribute_Details; // Attribute detail holds the mark color
      let imageCords = this.imageCoordsToCanvasCoords(element.PosX , element.PosY);
      ctx.arc(imageCords.x,imageCords.y,10,0,2*Math.PI);
      ctx.font = "14px Comic Sans MS";
      ctx.fillStyle = "red";
      ctx.fillText(element.Attribute_Index, imageCords.x, imageCords.y - 10 ); 
      ctx.stroke();
      ctx.closePath();
    });
  };

  SelectionMenuOnOff = props => {
    /*A function that controls if the selection menu is open or closed. */
    this.setState({
      show_menu: props
    })
  }; 

  createMark = async e => {
    /* A functions that creates the lice marks we see on the images
     x,y cordinates control where the marks will appear on the page.*/
    let x = e.pageX - e.target.offsetLeft, // Remove + 20
        y = e.pageY - e.target.offsetTop, // Remove + 20
        coords = this.canvasCoordsToImageCoords(x, y);
    
    this.drawCircle(x, y);
    // The image will be classified as Marked
    this.setState({
      xCoords: coords.x,
      yCoords: coords.y,
      menuX: e.pageX,
      menuY: e.pageY,
      show_menu: true,
    });
    this.SelectionMenuOnOff(true);
  };

  canvasCoordsToImageCoords = (x, y) => {
    // Helper function to change between coordinate systems.
    // Canvas element and image uses two different coordinate systems.
    // This function changes from canvas coordinates to image coordinates.
    // The drawImage function takes in image coordintes but when drawing on the canvas like
    // in drawCircle (used to mark images) canvas coordinates are used.
    let { sx, sy, swidth, sheight, width, height } = this.state;
    return {
      x: Math.round(sx+(Number(x)/width)*swidth + 'e0'),
      y: Math.round(sy+(Number(y)/height)*sheight + 'e0')
    };
  };

  imageCoordsToCanvasCoords = (x, y) => {
    // Helper function to change between coordinate systems.
    // Canvas element and image uses two different coordinate systems.
    // This function changes from image coordinates to canvas coordinates.
    // The drawImage function takes in image coordintes but when drawing on the canvas like
    // in drawCircle (used to mark images) canvas coordinates are used.
    let { sx, sy, swidth, sheight, width, height } = this.state;
    return {
      x: Math.round((x-sx)*(width/swidth) + 'e0'),
      y: Math.round((y-sy)*(height/sheight) + 'e0')
    };
  };
  
  imageZoom() {
  // A function that takes care of loading the zoom function
    var img, lens, result, cx, cy;
    img = document.getElementById("canvas");
    result = document.getElementById("zommedImage");
    /*create lens:*/
    lens = document.getElementById("Zoomlens");
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV*/
    result.style.backgroundImage = "url('" + this.props.imageURL + "')";
    //filter: brightness(100%) contrast(100%) invert(0) hue-rotate(0deg)
    result.style.backgroundSize =
      img.width * cx + "px " + img.height * cy + "px";
    result.style.filter =
      "brightness(100%) contrast(100%) invert(0) hue-rotate(0deg)";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);

    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens: the -20 is to offset the lens for our custom cursor */
      //x = pos.x - lens.offsetWidth / 2;
      //y = pos.y - lens.offsetHeight / 2;
      x = pos.x  - ( lens.offsetWidth / 2);
      y = pos.y  - ( lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) {
        x = img.width - lens.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > img.height - lens.offsetHeight) {
        y = img.height - lens.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";

      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
    }

    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  };

  handleTabSelect = (key) => {
    // Handle the selecting key for our Tabs
    this.setState({ key });
  };

  render() {
    let { isImageLoading, isImageLoaded, show_menu } = this.state;
    // Set the position of the Zoom window

    let ZoomPos = {
      top: this.state.zoomWindowPosY,
      left: this.state.width + 165
    };
    
    return (
      
      <div className="imageCanvasContainer">
        <div className="img-zoom-container">
          {isImageLoading && (
            <div className="SpinnerLocationImageCanvas">
              <Spinner />
            </div>
          )}

          { show_menu &&
            <SelectionMenu
              xCoords={this.state.xCoords}
              yCoords={this.state.yCoords}
              menuX={this.state.menuX}
              menuY={this.state.menuY}
              imageID={this.props.imageID}
              showTree={this.state.show_menu}
              SelectionMenuOnOff={this.SelectionMenuOnOff}
              reDrawImage={this.reDrawImage}
              imageAttributes={this.props.ImageAttributeList}
              populationID = {this.props.populationID}
              loadMarks={this.loadMarks}
              getImageAttribute={this.props.getImageAttribute}
              postImageAttribute={this.props.postImageAttributes}
            >
            </SelectionMenu> }

          <canvas onClick={this.createMark} id="canvas" className={ isImageLoaded ? "shadow-box" : ""}/>
          <div id="Zoomlens" className="img-zoom-lens" onClick={this.createMark}/>

          <div className="SideWindow" style={ZoomPos}>
            <div id="zommedImage" className={isImageLoaded ? "img-zoom-result shadow-box" : "img-zoom-result"} ></div>
            
            {isImageLoaded && (
              <div className="SideWindowText">
              <h4 id="ZoomText" className="ContainerText">Zoom Window</h4>
                {this.imageZoom()}
                <div className="imageFromContainer shadow-box">
                <Tabs
                  activeKey={this.state.key}
                  onSelect={this.handleTabSelect}
                  id="controlled-tabs"
                >
                  <Tab eventKey={1} title="Marking" className="TabContainer">
                    
                    <div className="ClassificationButtons">
                      {
                        this.props.isImageClassificationLoading ? 
                          <ButtonSpinner ClassName="Finish_Marking" Name="Finished Marking" /> 
                          : 
                          <button className="Finish_Marking" onClick={ () => this.props.imageClassification(4) }>Finished Marking</button>
                      }
                      {
                        this.props.isImageClassificationLoading ?
                        <ButtonSpinner ClassName="Reject_Marking" Name="Reject image" /> 
                        : 
                        <button className="Reject_Marking" onClick={ () => this.props.imageClassification(5) } >Reject image</button>  
                      }
                      
                    </div>
                        
                    <ImageForm 
                      ImageAttributeList = {this.props.ImageAttributeList}
                      deleteImageAttributes = {this.props.deleteImageAttributes}
                      isImageClassificationLoading={this.props.isImageClassificationLoading}
                      Weight={this.props.Weight}
                    />

                  </Tab>

                  <Tab eventKey={2} title="Image Effect" className="TabContainer">
  
                    <div className="ClassificationButtons">
                      <ImageEffect />
                    </div>

                  </Tab>
                  
                </Tabs>

                </div> 
              </div>
            )}
          </div>

        </div>
        
        </div>
    );
  }
}
export default ImageCanvas;

propTypes.ImageCanvas = {
  imageURL: propTypes.string,
  ImageAttributeList: propTypes.list,
  imageID: propTypes.string,
  populationID: propTypes.number,
  farmID: propTypes.number,
  isImageClassificationLoading: propTypes.boolean
};