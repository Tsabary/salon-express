import React, { useState } from "react";

import TextArea from "../../../formComponents/textArea";
import { connect } from "react-redux";

import { answerQuestion } from "../../../../actions";

const SingleQuestion = ({ q, answerQuestion }) => {
  const [values, setValues] = useState();

  return (
    <div className="tiny-margin-top">
      <div>{q.question}</div>
      <TextArea
        type="text"
        placeHolder="Your answer"
        onChange={setValues}
        value={values}
      />
      <div
        className="small-button"
        onClick={() =>
          answerQuestion(values, q, () => {
            console.log("do something");
          })
        }
      >
        Answer
      </div>
    </div>
  );
};

export default connect(null, { answerQuestion })(SingleQuestion);
// Opening a Room is absolutely free. Just click the "New Room" button at the top of your screen, fill in some etails about the Room and click "Open".