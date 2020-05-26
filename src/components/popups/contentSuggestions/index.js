import "./styles.scss";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "../../../constants";

import Suggestion from "./suggestion";
import { fetchSuggestions } from "../../../actions/global";

const ContentSuggestions = ({ contentSuggestions, fetchSuggestions }) => {
  useEffect(() => {
    if (!contentSuggestions.length) fetchSuggestions();
  }, []);

  const renderSuggestions = (sgstns) => {
    return sgstns.map((sg) => {
      return <Suggestion suggestion={sg} key={sg.id} />;
    });
  };

  return (
    <div
      className="popup"
      id="content-suggestions"
      // style={{
      //   maxHeight: "100%",
      //   maxWidth: "100%",
      //   width: "100%",
      //   height: "100%",
      // }}
    >
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      <div className="suggestions__instructions tiny-margin-top">
        To use one of our suggestions, open it in a new tab, generate a new
        private game link (if needed) copy it and paste it back in the "External
        Content" box. Click play.
      </div>
      <div className="small-margin-top fr">
      {renderSuggestions(contentSuggestions)}

        {/* <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {renderSuggestions(contentSuggestions)}
        </Masonry> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    contentSuggestions: state.contentSuggestions,
  };
};

export default connect(mapStateToProps, { fetchSuggestions })(
  ContentSuggestions
);
