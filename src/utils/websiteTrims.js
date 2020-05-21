import { trimURL } from "./forms";

export const mixCloudTrim = (s) => {
  const string = s.split("?")[0];
  if (string.includes("mixcloud.com")) {
    const splitArr = string.split("/");
    if (splitArr[splitArr.length - 1].length) {
      return splitArr[splitArr.length - 1];
    } else {
      return splitArr[splitArr.length - 2];
    }
  } else {
    return string;
  }
};

export const instagramTrim = (s) => {
  const string = s.split("?")[0];
  if (string.includes("instagram.com")) {
    const splitArr = string.split("/");
    if (splitArr[splitArr.length - 1].length) {
      return splitArr[splitArr.length - 1];
    } else {
      return splitArr[splitArr.length - 2];
    }
  } else {
    return string;
  }
};

export const spotifyTrim = (s) => {
  const string = s.split("?")[0];
  if (string.includes("spotify.com")) {
    const splitArr = string.split("/");
    if (splitArr[splitArr.length - 1].length) {
      return splitArr[splitArr.length - 1];
    } else {
      return splitArr[splitArr.length - 2];
    }
  } else {
    return string;
  }
};

export const beatportTrim = (s) => {
  const string = s.split("?")[0];
  if (string.includes("beatport.com")) {
    const splitArr = string.split("/");
    if (splitArr[splitArr.length - 1].length) {
      return `${splitArr[splitArr.length - 2]}/${
        splitArr[splitArr.length - 1]
      }`;
    } else {
      return `${splitArr[splitArr.length - 3]}/${
        splitArr[splitArr.length - 2]
      }`;
    }
  } else {
    return string;
  }
};

export const extractUrlId = (s) => {
  let spltArr, spltArr2, splt1, splt2;

  switch (true) {
    // stripping Youtube
    case s.includes("youtube.com/watch?v="):
      splt1 = s.split("watch?v=");
      if (splt1.length > 1) {
        // setFormError(null);
        return { source: "youtube", link: splt1[1].split("?")[0] };
      }

    // stripping Youtube
    case s.includes("youtu.be"):
      spltArr = s.split("/");
      splt1 = spltArr[spltArr.length - 1];

      // setFormError(null);
      return { source: "youtube", link: splt1.split("?")[0] };

    // stripping Twitch
    case s.includes("twitch.tv"):
      spltArr = s.split("/");
      splt1 = spltArr[spltArr.length - 1];

      // setFormError(null);
      return { source: "twitch", link: splt1.split("?")[0] };

    // stripping Mixlr
    case s.includes("mixlr.com"):
      spltArr = s.split("https://mixlr.com/users/");
      splt1 = spltArr[spltArr.length - 1];
      splt2 = splt1.split("/embed")[0];

      // setFormError(null);
      return { source: "mixlr", link: splt2 };

    // stripping MixCloud widget
    case s.includes("mixcloud.com/widget"):
      spltArr = s.split("%2F");
      splt1 = spltArr[1];
      splt2 = spltArr[2];

      // setFormError(null);
      return { source: "mixcloud", link: `${splt1}%2F${splt2}%2F` };

    // stripping MixCloud url
    case s.includes("mixcloud.com"):
      spltArr = s.split("?");
      spltArr2 = spltArr[0].split("/");

      if (spltArr2[spltArr2.length - 1]) {
        splt1 = spltArr2[spltArr2.length - 1];
        splt2 = spltArr2[spltArr2.length - 2];
      } else {
        splt1 = spltArr2[spltArr2.length - 3];
        splt2 = spltArr2[spltArr2.length - 2];
      }

      // setFormError(null);
      return { source: "mixcloud", link: `${splt1}%2F${splt2}%2F` };

    default:
      // setFormError(
      //   "Something isn't right with this data, please copy it and try again"
      // );
      return { source: "website", link: trimURL(s) };
  }
};
