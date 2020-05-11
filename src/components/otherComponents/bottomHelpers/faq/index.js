import "./styles.scss";
import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";

import algoliasearch from "algoliasearch/lite";

import { AuthContext } from "../../../../providers/Auth";

import { newQuestion } from "../../../../actions";

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);
const index = searchClient.initIndex("questions");

const Faq = ({ newQuestion }) => {
  const { currentUserProfile } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [inProcess, setInProcess] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    index
      .search(question)
      .then(({ hits }) => {
        setQuestions(hits);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [question]);

  const handleSubmit = () => {
    if (!question) return;
    setInProcess(true);
    newQuestion(question, currentUserProfile, () => {
      setQuestion("");
      setInProcess(false);
    });
  };

  const renderQuestions = (questions) => {
    return questions.map((q) => {
      return (
        <details className="faq__question" key={q.objectID}>
          <summary>{q.question}</summary>
          <div className="extra-tiny-margin-top"> {q.answer}</div>
        </details>
      );
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
        <div className="faq__questions">{renderQuestions(questions)}</div>

        <div className="faq__ask fr-max" id="faq__ask">
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
  );
};

export default connect(null, { newQuestion })(Faq);
