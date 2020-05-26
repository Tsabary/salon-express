import "./styles.scss";
import React from "react";

const Suggestion = ({ suggestion }) => {
  return (
    <div className="suggestion">
      <a href={suggestion.url} target="_blank" rel="noopener noreferrer">
        <div className="max-fr">
          {/* <div className="suggestion__cover-img">
            <img src={suggestion.image} alt="suggestion" />
          </div> */}

          <img
            src={suggestion.image}
            alt="suggestion"
            className="suggestion__image"
          />

          <div style={{padding:"2rem"}}>
            <div className="suggestion__title">{suggestion.title}</div>
            <div className="suggestion__description extra-tiny-margin-top">
              {suggestion.description}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Suggestion;
