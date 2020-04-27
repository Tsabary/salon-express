import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import "./styles.scss";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import { fetchQuestions } from "../../../actions";

const Faq = ({ fetchQuestions, questions }) => {
  useEffect(() => {
    if (questions.length === 0) fetchQuestions();
  });

  const renderQuestions = (questions) => {

    return questions.map((q) => {

      return (
        <details  key={q.id}>
        <summary className="question__title">
          {q.title}
          </summary>
          <div dangerouslySetInnerHTML={{__html: q.body}} className="question__body tiny-margin-top small-margin-bottom"/>
        </details>

      );
    });
  };

  return (
    <div className="about">
      <div className="about__container">
        <div className="about__title">Salon Express Help Center</div>
        <div className="about__questions small-margin-top">
          {renderQuestions(questions)}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
  };
};

export default connect(mapStateToProps, { fetchQuestions })(Faq);
