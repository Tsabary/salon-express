import React from "react";
import validator from "validator";

export const errorMessages = {
  title: "please add a title for this stream",
  body: "Please add some extra description for this stream",
  name: "Please enter a host's name",
  image: "Please add an image for this stream",
  url: "Please add link to this stream",
  urlInvalid: "Please make sure your stream's url is valid",
  startTime: "Please choose a starting time for this stream",
  duration: "Please set the duration of this stream",
  endTime: "Please choose an end time for this stream",
  timeOrder: "Your stream end time is before its start time",
  tagsMin: "Please add at least 2 tags",
  tagsMax: "Add up to 5 tags maximum",
  web: "Please enter a valid URL for your website",
  ig: "Please enter a valid URL for your Instagram account",
  fb: "Please enter a valid URL for your Facebook page",
  twitter: "Please enter a valid URL for your Twitter account"
};

export const checkValidity = (values, setFormError, imageAsFile) => {
  switch (true) {
    case !imageAsFile && !values.image:
      setFormError(errorMessages.image);
      return false;

    case !values.title:
      setFormError(errorMessages.title);
      return false;

    case !values.body:
      setFormError(errorMessages.body);
      return false;

    case !values.host_name:
      setFormError(errorMessages.name);
      return false;

    case !values.start:
      setFormError(errorMessages.startTime);
      return false;

    case values.duration === 0:
      setFormError(errorMessages.duration);
      return false;

    case !values.url:
      setFormError(errorMessages.url);
      return false;

    case !validator.isURL(values.url):
      setFormError(errorMessages.urlInvalid);
      return false;

    case values.host_ig && !validator.isURL(values.host_ig):
      setFormError(errorMessages.ig);
      return false;

    case values.host_fb && !validator.isURL(values.host_fb):
      setFormError(errorMessages.fb);
      return false;

    case values.host_twitter && !validator.isURL(values.host_twitter):
      setFormError(errorMessages.twitter);
      return false;

    case values.host_web && !validator.isURL(values.host_web):
      setFormError(errorMessages.web);
      return false;

    case (values && !values.tags) || (values.tags && values.tags.length < 2):
      setFormError(errorMessages.tagsMin);
      return false;

    default:
      return true;
  }
};

export const trimURL = string => {
  return string.replace(/^https?:\/\//, "").replace(/^http?:\/\//, "");
};

export const renderHours = () => {
  const hours = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24
  ];

  return hours.map(h => {
    return <option className="form-drop">{h} hours</option>;
  });
};

export const renderMinutes = () => {
  const minutes = [0, 15, 30, 45];

  return minutes.map(m => {
    return <option className="form-drop">{m} minutes</option>;
  });
};
