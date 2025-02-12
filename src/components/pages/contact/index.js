import "./styles.scss";
import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../../providers/Auth";

import InputField from "../../formComponents/inputField";
import TextArea from "../../formComponents/textArea";

const Contact = () => {
  const { currentUserProfile } = useContext(AuthContext);
  const [values, setValues] = useState({
    email: "",
    content: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (currentUserProfile)
      setValues((values) => {
        return { ...values, email: currentUserProfile.email };
      });
  }, [currentUserProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables = {
      message_html: values.content,
      from_email: values.email,
    };

    window.emailjs
      .send("gmail", "contact", variables, "user_hE0SyjVsZawiPWprq0Att")
      .then((res) => {
        setSent(true);
      })
      .catch((err) =>
        console.error(
          "Oh well, you failed. Here some thoughts on the error that occured:",
          err
        )
      );

    setValues({});
  };

  return (
    <div className="contact medium-margin-bottom">
      <div className="section__container">
        <h2 className="small-margin-top">
          Do you have any questions? Suggestions?
          <br />
          Experiencing any bugs? We're here for you.
        </h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="small-margin-top">
            <div className="tiny-margin-bottom">
              <InputField
                type="email"
                placeHolder="Email address"
                value={values.email}
                onChange={(email) => setValues({ ...values, email })}
              />
            </div>

            <TextArea
              type="text"
              placeHolder="What would you like to tell us?"
              value={values.content}
              onChange={(content) => setValues({ ...values, content })}
            />
            <div className="fr-max">
              <div />
              <button
                type="submit"
                className="boxed-button small-margin-top justify-end"
              >
                Send
              </button>
            </div>
          </form>
        ) : (
          <div>
            Thank you! We've received your message and would get in touch soon!
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
