import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { fetchQuestions } from "../../../actions";

import SingleQuestion from "./singleQuestion";

const AnswerQuestions = ({ fetchQuestions, questions }) => {
  const [answered, setAnswered] = useState([]);
  const [unanswered, setUnanswered] = useState([]);

  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestions();
    } else {
      questions.forEach((q) => {
        q.answer
          ? setAnswered((vals) => {
              return [...vals, q];
            })
          : setUnanswered((vals) => {
              return [...vals, q];
            });
      });
    }
  }, [questions]);

  const renderQuestions = (questions) => {
    return questions.map((q) => {
      return <SingleQuestion q={q} setAnswered={setAnswered} setUnanswered={setUnanswered}/>;
    });
  };

  return (
    <div className="about">
      <div className="about__container">
        <div className="about__title">Salon Express Help Center </div>
        <div className="about__questions small-margin-top">
          {renderQuestions(unanswered)}
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

export default connect(mapStateToProps, { fetchQuestions })(AnswerQuestions);
