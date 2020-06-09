import React from "react";
import validator from "validator";

export const errorMessages = {
  title: "please add a title for this room",
  body: "Please add some extra description for this room",
  name: "Please enter a host's name",
  image: "Please add an image for this room",
  url: "Please add link to this room",
  urlInvalid: "Please make sure your room's url is valid",
  language: "Please choose the language for the room",
  practice_language: "Please choose the language you want to practice",
  base_language: "Please choose the base language for this conference",
  level:
    "Please choose the level of knowledge participants should have in the practiced language",
  startTime: "Please choose a starting time for this room",
  duration: "Please set the duration of this room",
  endTime: "Please choose an end time for this room",
  timeOrder: "Your room end time is before its start time",
  tagsMin: "Please add at least 2 tags",
  tagsMax: "Add up to 5 tags maximum",
  web: "Please enter a valid URL for your website",
  ig: "Please enter a valid URL for your Instagram account",
  fb: "Please enter a valid URL for your Facebook page",
  twitter: "Please enter a valid URL for your Twitter account",
  linkedin: "Please enter a valid URL for your LinkedIn account",
  tips: "Please enter a valid PayPal payment link",
};

export const checkValidity = (values, setFormError) => {
  switch (true) {
    case !values.title && !values.name:
      setFormError(errorMessages.title);
      return false;

    case !values.language:
      setFormError(errorMessages.language);
      return false;

    case (values && !values.tags) || (values.tags && values.tags.length < 2):
      setFormError(errorMessages.tagsMin);
      return false;

    default:
      setFormError(null);
      return true;
  }
};

export const trimURL = (string) => {
  const newString = string
    ? string.replace(/^https?:\/\//, "").replace(/^http?:\/\//, "")
    : string;
  return newString;
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
    24,
  ];

  return hours.map((h) => {
    return (
      <option className="form-drop" key={h}>
        {h} hours
      </option>
    );
  });
};

export const renderMinutes = () => {
  const minutes = [0, 15, 30, 45];

  return minutes.map((m) => {
    return (
      <option className="form-drop" key={m}>
        {m} minutes
      </option>
    );
  });
};

export const proffesionalCategories = [
  "Graphics & Design",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "Programming & Tech",
  "Business",
  "Lifestyle",
];

export const renderCategories = (categories) => {
  return categories.map((cat) => {
    return (
      <option className="form-drop" key={cat}>
        {cat}
      </option>
    );
  });
};

export const getCategoryCode = (cat) => {
  switch (cat) {
    case "Graphics & Design":
      return "gnd";

    case "Digital Marketing":
      return "dm";

    case "Writing & Translation":
      return "wnt";

    case "Video & Animation":
      return "vna";

    case "Music & Audio":
      return "mna";

    case "Programming & Tech":
      return "pnt";

    case "Business":
      return "bsns";

    case "Lifestyle":
      return "lfstl";
  }
};

export const getCategoryName = (cat) => {
  switch (cat) {
    case "gnd":
      return "Graphics & Design";

    case "dm":
      return "Digital Marketing";

    case "wnt":
      return "Writing & Translation";

    case "vna":
      return "Video & Animation";

    case "mna":
      return "Music & Audio";

    case "pnt":
      return "Programming & Tech";

    case "bsns":
      return "Business";

    case "lfstl":
      return "Lifestyle";
  }
};
