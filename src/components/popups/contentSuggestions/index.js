import "./styles.scss";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";

import { fetchSuggestions, addUserSuggestion } from "../../../actions/global";
import { AuthContext } from "../../../providers/Auth";

import Suggestion from "./suggestion";
import TextArea from "../../formComponents/textArea";
import InputField from "../../formComponents/inputField";
import validator from "validator";

const ContentSuggestions = ({
  contentSuggestions,
  fetchSuggestions,
  addUserSuggestion,
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [values, setValues] = useState({});
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (currentUserProfile)
      setValues({
        user_ID: currentUserProfile.uid,
        email: currentUserProfile.email,
        name: currentUserProfile.name,
      });
  }, [currentUserProfile]);

  useEffect(() => {
    if (!contentSuggestions.length) fetchSuggestions();
  }, []);

  const renderSuggestions = (sgstns) => {
    return sgstns.map((sg) => {
      return <Suggestion suggestion={sg} key={sg.id} />;
    });
  };

  const handleSubmit = () => {
    if ((values.url && validator.isURL(values.url)) || values.extra) {
      addUserSuggestion(values, () => {
        setFormError("");
        setValues({ ...values, extra: "", url: "" });
      });
    } else {
      setFormError("Please add some information or a valid URL");
    }
  };

  return (
    <div className="popup" id="content-suggestions">
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

        <div className="section__container">
          <div className="section__title">Suggest Something New</div>
          <div className="suggestions__new-title">
            Got ideas for some great content we absolutely have to add? Please
            let us know!
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <InputField
              type="text"
              placeHolder="Name"
              value={values.name}
              onChange={(name) => setValues({ ...values, name })}
              className="tiny-margin-top"
            />

            <InputField
              type="email"
              placeHolder="Email"
              value={values.email}
              onChange={(email) => setValues({ ...values, email })}
              className="tiny-margin-top"
            />

            <InputField
              type="text"
              placeHolder="URL"
              value={values.url}
              onChange={(url) => setValues({ ...values, url })}
              className="tiny-margin-top"
            />

            <TextArea
              type="text"
              placeHolder="Anything else you'd like to add?"
              value={values.extra}
              onChange={(extra) => setValues({ ...values, extra })}
              className="tiny-margin-top"
            />

            {formError ? (
              <div className="form-error tiny-margin-top">{formError}</div>
            ) : null}

            <button
              className="small-button centered tiny-margin-top"
              type="submit"
            >
              Share some Greatness
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    contentSuggestions: state.contentSuggestions,
  };
};

export default connect(mapStateToProps, {
  fetchSuggestions,
  addUserSuggestion,
})(ContentSuggestions);
