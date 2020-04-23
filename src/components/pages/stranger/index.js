import "./styles.scss";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";

import { AuthContext } from "../../../providers/Auth";

import { fetchStrangerProfile } from "../../../actions";

import FollowBtn from "../../otherComponents/followBtn";
import { getLanguageName } from "../../../utils/languages";
import Social from '../../otherComponents/social';

const Stranger = ({ match, strangerProfile, fetchStrangerProfile }) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [stranger, setStranger] = useState(null);


  useEffect(() => {
    if (match.params.id) fetchStrangerProfile(match.params.id, setStranger);
  }, [match.params.id]);

  return !stranger ? null : (
    <div className="stranger">
      <div className="stranger__header">
        <div>
          <img
            className="stranger__header-img"
            src={
              (stranger && stranger.avatar) ||
              "../../imgs/logo.jpeg"
            }
          />
        </div>
        <div className="stranger__header-body">
          <div className="stranger__header-name">
            {stranger && stranger.name}
          </div>

          <div className="stranger__header-tagline">
            {stranger && stranger.description}
          </div>

        </div>
        {stranger ? <Social data={stranger} /> : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    strangerProfile: state.strangerProfile,
  };
};

export default connect(mapStateToProps, {
  fetchStrangerProfile,
})(Stranger);
