import React from "react";
import "./ThumbnailContainer.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import ThumbnailItem from "./ThumbnailItem";
import { ButtonSpinner } from "../Components/Button_spinner";

class ThumbnailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      populationID: "",
      startDate: moment().subtract(165, "days"),
      endDate: moment().subtract(165, "days"),
      focusedInput: null,
      focused: null,
      // Selecting Farms
      farmIndex: 0,
      populations: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentOrg !== this.props.currentOrg) {
      this.setState({
        currentOrg: this.props.currentOrg,
        populations: [],
        thumbnailList: [],
        populationID: 0
      });
    }
    if (prevState.endDate !== this.state.endDate) {
      this.props.handleChangeImage(null);
    }
    if (prevState.startDate !== this.state.startDate) {
      this.props.handleChangeImage(null);
    }
  }

  submitSelection = () => {
    let populationID = this.state.populationID;

    //If Start and end dates are not selected we will not submit a search and ask user to correct date selection
    let startD, endD;
    try {
      startD = moment(this.state.startDate._d).format("YYYY-MM-DD");
    } catch (error) {
      /* alert("Please Select Start Date"); */
    }
    try {
      endD = moment(this.state.endDate._d).format("YYYY-MM-DD");
    } catch (error) {
      /* alert("Please Select End Date"); */
    }

    if (this.state.populationID === "") {
      alert("Please Select a Population");
    } else if (this.state.populationID === (0 || "0")) {
      alert("Please Select a Population");
    } else if (startD === undefined || endD === undefined) {
      alert("Please Select End Date");
    } else {
      this.setState({
        isThumbnailLoading: true,
        isThumbnailListLoaded: false
      });
      this.props.handleChangeDate(startD, endD);
      console.log(populationID, startD, endD)
      this.props.fetchThumbnailList(populationID, startD, endD);
    }
  };

  changeFarm = event => {
    let { currentOrg } = this.props;
    this.props.handleChangeFarm(
      currentOrg.farms.items[event.target.value].farmID
    );

    this.setState({
      farmIndex: event.target.value,
      populationID: "",
      populations: currentOrg.farms.items[event.target.value].population.items
    });
  };

  changePop = event => {
    this.props.handleChangePopulation(event.target.value);
    this.setState({
      populationID: event.target.value
    });
  };

  render() {
    let { populations } = this.state,
      { currentOrg, thumbnailList, isThumbnailListLoaded, isThumbnailLoading } = this.props;
    let listLenght;

      if (thumbnailList[0] === "No Images Found") {
        listLenght = 0;
      } else {
        listLenght = thumbnailList.length;
      }
    
    return (
      <div className="Thumbnail_container">
        {/*Thumbnail container allows for selecting */}
        <div className="view_images_header_div">

          <div className="FarmPopSelect">
            <select onChange={this.changeFarm}>
              <option value={0}>Select Farm</option>
              {currentOrg.farms.items.map((o, i) => (
                <option key={`dropdown${o.farmName}`} value={i}>
                  {o.farmName}
                </option>
              ))}
            </select>

            <select onChange={this.changePop}>
              <option value={0}>Select Population</option>
              {populations.map(p => (
                <option key={`farmDropdown${p.popID}`} value={p.popID}>
                  {p.popName}
                </option>
              ))}
            </select>

            <DateRangePicker
              startDateId={"startingDate"}
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              endDateId={"endingDate"}
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate }) } // PropTypes.func.isRequired,
              displayFormat="DD-MM-YYYY"
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              isOutsideRange={() => false} //allow any date
            />
            {isThumbnailLoading ? (
              <ButtonSpinner Name="Submit" ClassName={"submit_button"} />
            ) : (
              <button onClick={this.submitSelection} className="submit_button"> Submit </button>
            )}
          </div>
        </div>
        { isThumbnailListLoaded ? (
          <div id="thumbnail_items">
            <span className="Image_count">
              Number of images: {listLenght}
            </span>
            <ThumbnailItem
              thumbnailList={thumbnailList}
              handleClick={this.props.handleClick}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default ThumbnailContainer;
