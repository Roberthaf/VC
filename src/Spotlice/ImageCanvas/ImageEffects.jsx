import React, { Component } from "react";
import "./ImageEffects.css";
import RangeSlider from "../Components/RangeSlider";
import { Button } from "react-bootstrap";

class ImageEffects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contrast: 100, // in % Adjusts the contrast of the image.
      brightness: 100, // in % Adjusts the brightness of the image.
      invert: 0, // in % Inverts the samples in the image.
      huerotate: 0, // in degrees 0-360°
      canvasID: null, // Get the name of the canvas
      // for image rendering
      height: 0,
      width: 0,
      originalIMG: "",
      isClicked: false,
      sharp: 0,
    };
    this.sliderInputCT = this.sliderInputCT.bind(this); // contrast
    this.sliderInputIV = this.sliderInputIV.bind(this); // contrast
    this.sliderInputBN = this.sliderInputBN.bind(this); // Brightness
    this.sliderInputHR = this.sliderInputHR.bind(this); // Hue Rotation
    //this.sliderInputSHARP = this.sliderInputSHARP.bind(this); // Sharpening
    this.imageModify = this.imageModify.bind(this);
    this.sharpenFilter = this.sharpenFilter.bind(this);
    this.invertFilter = this.invertFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.brightnessFilter = this.brightnessFilter.bind(this);
  }; 

  imageModify() {
    let canvas = document.getElementById("canvas");
    //let zoomed = document.getElementById("zommedImage");
    let styling_canvas = `
      -webkit-filter: 
        brightness(${this.state.brightness}%) 
        contrast(${this.state.contrast}%) 
        invert(${this.state.invert})
        hue-rotate(${this.state.huerotate}deg);
      filter: 
        brightness(${this.state.brightness}%) 
        contrast(${this.state.contrast}%) 
        invert(${this.state.invert})
        hue-rotate(${this.state.huerotate}deg)`;
    if (!!canvas) {
      canvas.style.cssText = styling_canvas;
    }
  };

  // Control the slider inputs for the sliders.
  sliderInputCT(event) {
    this.setState({
      contrast: event.target.value
    });
  }

  sliderInputIV(event) {
    this.setState({
      invert: event.target.value
    });
  };

  sliderInputBN(event) {
    this.setState({
      brightness: event.target.value
    });
  };

  /*   sliderInputSHARP(event) {
    let canvasID = this.state.canvasID;
    let c = document.getElementById(canvasID);
    var ctx = c.getContext("2d");
    var h = c.height;
    var w = c.width;
    // mix er sharpen value
    var mix = event.target.value;

    // Store the original Image as a state object. To be used to "Clear" the filter later
    if (this.state.isClicked === false) {
      var imgData = ctx.getImageData(0, 0, c.width, c.height);
      this.setState({
        originalIMG: imgData
      });
    } else {
      // do not add next imgData to state
    }
    //var imgData=ctx.getImageData(0,0,c.width,c.height);
    this.setState({
      isClicked: true,
    });
    //var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0]; // regular sharpen
    //var weights = [-1, -1, -1,-1, 9, -1, -1, -1, -1]; // A convolution filter matrix
    var weights = [1, 1, 1, 1, 0.7, -1, -1, -1, -1]; //  version 2 convolution filter
    //var weights = [-1, -1, -1, -1, 0.9, 1, 1, 1, 1]; //  version 3 convolution filter

    var katet = Math.round(Math.sqrt(weights.length));
    var half = (katet * 0.5) | 0;
    var dstData = ctx.createImageData(w, h);
    var dstBuff = dstData.data;
    var srcBuff = ctx.getImageData(0, 0, w, h).data;

    var y = h;
    while (y--) {
      var x = w;
      while (x--) {
        var sy = y;
        var sx = x;
        var dstOff = (y * w + x) * 4;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        for (var cy = 0; cy < katet; cy++) {
          for (var cx = 0; cx < katet; cx++) {
            var scy = sy + cy - half;
            var scx = sx + cx - half;
            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              var srcOff = (scy * w + scx) * 4;
              var wt = weights[cy * katet + cx];

              r += srcBuff[srcOff] * wt;
              g += srcBuff[srcOff + 1] * wt;
              b += srcBuff[srcOff + 2] * wt;
              a += srcBuff[srcOff + 3] * wt;
            }
          }
        }
        dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
        dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
        dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
        dstBuff[dstOff + 3] = a + srcBuff[dstOff + 3];
        // án þess að nota slder
        // dstBuff[dstOff] = r + srcBuff[dstOff];
        // dstBuff[dstOff + 1] = g + srcBuff[dstOff + 1];
        // dstBuff[dstOff + 2] = b + srcBuff[dstOff + 2];
        // dstBuff[dstOff + 3] = a + srcBuff[dstOff + 3];
      }
    }
    ctx.putImageData(dstData, 0, 0);

       
    // if(event.target.value==='0'){
    //     let canvasID = this.state.canvasID;
    //     let canvas = document.getElementById(canvasID);
    //     let ctx = canvas.getContext("2d");
    //     ctx.putImageData(this.state.originalIMG, 0, 0);
    // }
    
    this.setState({
      sharp: event.target.value
    });
  } 
*/

  sliderInputHR(event) {
    this.setState({
      huerotate: event.target.value
    });
  };

  // Clear the filter
  clearFilter() {
    let canvasID = `canvasID:${this.state.canvasID}`;
    let canvas = document.getElementById(canvasID);
    if (!!canvas) {
      canvas.style.cssText = "filter: none;";
    }
    this.setState({
      contrast: 100, // in % Adjusts the contrast of the image.
      brightness: 100, // in % Adjusts the brightness of the image.
      invert: 0, // in % Inverts the samples in the image.
      huerotate: 0,
      sharp: 0
    });
  };

  sharpenFilter() {
    let canvasID = `canvasID:${this.state.canvasID}`;
    let c = document.getElementById(canvasID);
    var ctx = c.getContext("2d");
    var h = c.height;
    var w = c.width;
    // mix er sharpen value
    //var mix = this.state.sharp;
    var mix = 1;

    // Store the original Image as a state object. To be used to "Clear" the filter later
    if (this.state.isClicked === false) {
      var imgData = ctx.getImageData(0, 0, c.width, c.height);
      this.setState({
        originalIMG: imgData
      });
    } else {
      // do not add next imgData to state
    }
    //var imgData=ctx.getImageData(0,0,c.width,c.height);
    this.setState({
      isClicked: true
    });
    //var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0]; // regular sharpen
    //var weights = [-1, -1, -1,-1, 9, -1, -1, -1, -1]; // A convolution filter matrix
    var weights = [1, 1, 1, 1, 0.7, -1, -1, -1, -1]; //  version 2 convolution filter
    //var weights = [-1, -1, -1, -1, 0.9, 1, 1, 1, 1]; //  version 3 convolution filter

    var katet = Math.round(Math.sqrt(weights.length));
    var half = (katet * 0.5) | 0;
    var dstData = ctx.createImageData(w, h);
    var dstBuff = dstData.data;
    var srcBuff = ctx.getImageData(0, 0, w, h).data;

    var y = h;
    while (y--) {
      var x = w;
      while (x--) {
        var sy = y;
        var sx = x;
        var dstOff = (y * w + x) * 4;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        for (var cy = 0; cy < katet; cy++) {
          for (var cx = 0; cx < katet; cx++) {
            var scy = sy + cy - half;
            var scx = sx + cx - half;
            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              var srcOff = (scy * w + scx) * 4;
              var wt = weights[cy * katet + cx];

              r += srcBuff[srcOff] * wt;
              g += srcBuff[srcOff + 1] * wt;
              b += srcBuff[srcOff + 2] * wt;
              a += srcBuff[srcOff + 3] * wt;
            }
          }
        }
        dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
        dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
        dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
        dstBuff[dstOff + 3] = a + srcBuff[dstOff + 3];
        // án þess að nota slder
        // dstBuff[dstOff] = r + srcBuff[dstOff];
        // dstBuff[dstOff + 1] = g + srcBuff[dstOff + 1];
        // dstBuff[dstOff + 2] = b + srcBuff[dstOff + 2];
        // dstBuff[dstOff + 3] = a + srcBuff[dstOff + 3];
      }
    }
    ctx.putImageData(dstData, 0, 0);
  };

  // A filter to invert the colors in the image
  invertFilter() {
    let canvasID = `canvasID:${this.state.canvasID}`;
    let c = document.getElementById(canvasID);

    let ctx = c.getContext("2d");
    let imgData = ctx.getImageData(0, 0, c.width, c.height);
    // invert colors
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = 255 - imgData.data[i];
      imgData.data[i + 1] = 255 - imgData.data[i + 1];
      imgData.data[i + 2] = 255 - imgData.data[i + 2];
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  brightnessFilter() {
    let canvasID = `canvasID:${this.state.canvasID}`;
    let c = document.getElementById(canvasID);

    let ctx = c.getContext("2d");
    let imgData = ctx.getImageData(0, 0, c.width, c.height);
    // invert colors
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] + 10;
      imgData.data[i + 1] = imgData.data[i + 1] + 10;
      imgData.data[i + 2] = imgData.data[i + 2] + 10;
      imgData.data[i + 3] = imgData.data[i + 3]  + 10;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  render() {
    this.imageModify();
    return (
      <div className="slider-controls">
        <div id="contrast_container" className="slider-wrapper">
          <label className="input-Text">Contrast {this.state.contrast}%</label>
          <RangeSlider
            Id="contrast"
            Value={this.state.contrast}
            OnChange={this.sliderInputCT}
            Min={0}
            Max={200}
            Step={10}
            tickmarkID={"tickmarks1"}
          />
          <datalist id="tickmarks1" className="slider">
            <option value="0" label="0" />
            <option value="20" />
            <option value="40" />
            <option value="60" />
            <option value="80" />
            <option value="100" label="100" />
            <option value="120" />
            <option value="140" />
            <option value="160" />
            <option value="180" />
            <option value="200" label="200" />
          </datalist>
        </div>

        <div id="brightness_container" className="slider-wrapper">
          <label className="input-text">
            Brightness {this.state.brightness}%
          </label>
          <RangeSlider
            Id="brightness"
            Value={this.state.brightness}
            OnChange={this.sliderInputBN}
            Min={0}
            Max={300}
            Step={20}
            tickmarkID={"tickmarks2"}
          />
          <datalist id="tickmarks2" className="slider">
            <option value="20" />
            <option value="40" />
            <option value="60" />
            <option value="80" />
            <option value="100" />
            <option value="120" />
            <option value="140" />
            <option value="160" />
            <option value="180" />
            <option value="200" />
            <option value="220" />
            <option value="240" />
            <option value="260" />
            <option value="280" />
          </datalist>
        </div>

        <div id="huerotate_container" className="slider-wrapper">
          <label className="input-text">
            Hue Rotation {this.state.huerotate}°deg
          </label>
          <RangeSlider
            Id="huerotate"
            Value={this.state.huerotate}
            OnChange={this.sliderInputHR}
            Min={0}
            Max={360}
            Step={10}
            tickmarkID={"tickmarks3"}
          />
          <datalist id="tickmarks3" className="slider">
            <option value="0" />
            <option value="40" />
            <option value="80" />
            <option value="120" />
            <option value="160" />
            <option value="200" />
            <option value="240" />
            <option value="280" />
            <option value="320" />
            <option value="360" />
          </datalist>
        </div>

        <div id="Invert_container" className="slider-wrapper">
          <label className="input-text">Invert On/Off</label>
          <RangeSlider
            Id="Invert"
            Value={this.state.invert}
            OnChange={this.sliderInputIV}
            Min={0}
            Max={1}
            tickmarkID={"tickmarks4"}
          />
          <datalist id="tickmarks4" className="slider">
            <option value="0" />
            <option value="1" />
          </datalist>
        </div>

        <div className="button-wrapper">
          <Button
            bsstyle="info"
            className="clearButton"
            onClick={this.clearFilter}
          >
            Clear Filters
          </Button>
          
{/*          <Button
            bsstyle="info"
            onClick={this.sharpenFilter}
          >
          Sharpness
          </Button>
{/*          <Button
            bsstyle="info"
            className="invert"
            onClick={this.invertFilter}
          >
          Invert Image
          </Button>

          <Button
            bsstyle="info"
            className="invert"
            onClick={this.brightnessFilter}
          >
          brightness
</Button>*/}
        </div>

{/*        <div id="sharpness_container" className="slider-wrapper">
          <label className="input-Text">Sharpness</label>
          <RangeSlider
            Id="sharpness"
            Value={this.state.sharp}
            OnChange={this.sliderInputSHARP}
            Min={0}
            Max={2}
          />
          <label className="input-Value">{this.state.sharp}%</label>
</div>*/}
      </div>
    );
  }
}
export default ImageEffects;