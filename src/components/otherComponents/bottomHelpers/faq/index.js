import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";

import { AuthContext } from "../../../../providers/Auth";

import { newQuestion } from "../../../../actions";

const Faq = ({ newQuestion }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [inProcess, setInProcess] = useState(false);

  const handleSubmit = () => {
    setInProcess(true);
    newQuestion(question, currentUserProfile, () => {
      setQuestion("");
      setInProcess(false);
    });
  };

  return (
    <div className="updates">
      <input
        className="updates__checkbox"
        type="checkbox"
        id="faq"
        onChange={() => setOpen(!open)}
        // readOnly
      />
      <label className="max-max updates__top" htmlFor="faq">
        <div className="updates__title">Frequantly asked questions</div>
      </label>
      <div className="updates__container">
        <div className="faq__container">
          {question ? (
            <div className="faq__questions">Questions</div>
          ) : (
            <div className="faq__instructions">
              Start typing to find answers to frequently asked questions. Can't
              find your question? Click submit and we'll add a new answer
              shortly
            </div>
          )}
          <div className="fr-max">
            <input
              className="faq__input"
              type="text"
              placeholder="What would you like to know?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {inProcess ? (
              <div className="small-button small-button--disabled">New</div>
            ) : (
              <div className="small-button" onClick={handleSubmit}>
                New
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { newQuestion })(Faq);
