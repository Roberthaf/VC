import React from "react";
import moment from "moment";
import "./ThumbnailItem.css";
const ThumbnailItem = props => (
  <div className="ScrollStyle flex-container thumbnailListContainer">
    {props.thumbnailList.map((thumbnail, index) => {
      let date = moment(thumbnail.Recorded_Datetime).format("YYYY-MM-DD HH:mm:ss");
      if(thumbnail === "No Images Found"){
        return (<div key={`noimagefound`}><h4>{thumbnail}</h4></div>)
      }else{
      return (
        <div key={thumbnail.Photo_ID} id={index} value={thumbnail.Photo_ID} >
          <div
            className={`imageItem`}
            onClick={data =>
              props.handleClick(
                thumbnail.Photo_ID,
                thumbnail.imageUrl,
                index,
                thumbnail.Classification_ID
              )
            }
            value={thumbnail.Photo_ID}
          >
            <img
              value={thumbnail.Photo_ID}
              src={thumbnail.thumbnailUrl}
              alt=""
            />
            <span className={`caption ${thumbnail.Classification_Name}`}>
              {thumbnail.Classification_Name}
            </span>
            <span className="caption">{date}</span>
            <span className="caption">Image ID:{thumbnail.Photo_ID}</span>
            {thumbnail.Weight > 0 ? (
              <span className="caption">Weight: {thumbnail.Weight}g</span>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }
    })}
  </div>
);
export default ThumbnailItem;

/*            {thumbnail.Weight > 0 ? (
              <span className="caption">Weight: {thumbnail.Weight}g</span>
            ) : (
              ""
            )}*/