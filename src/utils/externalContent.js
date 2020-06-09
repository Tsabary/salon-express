import { trimURL } from "./forms";

const getStringBeforeParams = (str) => {
  return str.split("?")[0];
};

const getStringAfterParams = (str) => {
  return str.split("?")[1];
};

const getLastStringAfterSlash = (str) => {
  const split = str.split("/");

  if (split[split.length - 1].length) {
    return split[split.length - 1];
  } else {
    return split[split.length - 2];
  }
};

const getLastTwoStringsAfterSlash = (arr) => {
  if (arr[arr.length - 1].length) {
    return `${arr[arr.length - 2]}/${arr[arr.length - 1]}`;
  } else {
    return `${arr[arr.length - 3]}/${arr[arr.length - 2]}`;
  }
};

const extractFirstEqualValue = (str) => {
  return str.split("=")[1];
};

export const detactPlatform = (url) => {
  switch (true) {
    case url.includes("beatport.com"):
      return "bp";

    case url.includes("facebook.com"):
      return "fb";

    case url.includes("instagram.com"):
      return "ig";

    case url.includes("linkedin.com"):
      return "li";

    case url.includes("mixcloud.com"):
      return "mc";

    case url.includes("soundcloud.com"):
      return "sc";

    case url.includes("spotify.com") && url.includes("artist"):
      return "spfy-ar";

    case url.includes("spotify.com") && url.includes("user"):
      return "spfy-us";

    case url.includes("twitter.com"):
      return "ttr";

    case url.includes("twitch.tv"):
      return "tw";

    case url.includes("youtube.com"):
      return "yt";

    default:
      return "ws";
  }
};

export const extractUrlId = (platform, str) => {
  // console.log("chaaaa", platform);

  switch (platform) {
    case "bp":
      return getLastTwoStringsAfterSlash(getStringBeforeParams(str)); // https://www.beatport.com/chart/ + content

    case "fb":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://www.facebook.com/ + content

    case "ig":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://www.instagram.com/ + content

    case "li":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://www.linkedin.com/in/

    case "mc":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://www.mixcloud.com/ + content

    case "sc":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://soundcloud.com/

    case "spfy-ar":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://open.spotify.com/artist/

    case "spfy-us":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://open.spotify.com/user/

    case "ttr":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://twitter.com/ + content

    case "tw":
      return getLastStringAfterSlash(getStringBeforeParams(str)); // https://twitch.tv/ + content

    case "yt":
      return extractFirstEqualValue(getStringAfterParams(str)); // https://www.youtube.com/ + content

    case "ws":
      return trimURL(str);
  }
};

export const getPlatformPrefix = (id) => {
  switch (id) {
    case "bp":
      return "https://www.beatport.com/chart/";

    case "fb":
      return "https://www.facebook.com/";

    case "ig":
      return "https://www.instagram.com/";

    case "li":
      return "https://www.linkedin.com/in/";

    case "mc":
      return "https://www.mixcloud.com/";

    case "sc":
      return "https://soundcloud.com/";

    case "spfy-ar":
      return "https://open.spotify.com/artist/";

    case "spfy-us":
      return "https://open.spotify.com/user/";

    case "ttr":
      return "https://twitter.com/";

    case "tw":
      return "https://twitch.tv/";

    case "yt":
      return "https://www.youtube.com/";

    case "ws":
      return "https://";
  }
};

export const getPlatformPlaceHolder = (plat) => {
  switch (plat) {
    case "bp":
      return "Your Beatport profile";

    case "fb":
      return "Your Facebook profile";

    case "ig":
      return "Your Instagram handle";

    case "li":
      return "Your LinkedIn profile";

    case "mc":
      return "Your MixCloud profile";

    case "sc":
      return "Your SoundCloud profile";

    case "spfy-ar":
      return "Your Spotify artist profile";

    case "spfy-us":
      return "Your Spotify user profile";

    case "ttr":
      return "Your Twitter profile";

    case "tw":
      return "Your Twitch channel";

    case "ws":
      return "Your website's url";

    case "yt":
      return "Your Youtube channel";
  }
};

export const getPlatformCode = (plat) => {
  switch (plat) {
    case "Beatport":
      return "bp";

    case "Facebook":
      return "fb";

    case "Instagram":
      return "ig";

    case "LinkedIn":
      return "li";

    case "MixCloud":
      return "mc";

    case "SoundCloud":
      return "sc";

    case "Spotify Artist":
      return "spfy-ar";

    case "Spotify User":
      return "spfy-us";

    case "Twitter":
      return "ttr";

    case "Twitch":
      return "tw";

    case "Website":
      return "ws";

    case "Youtube":
      return "yt";
  }
};

export const allPlatforms = [
  // A

  // B
  "Beatport",
  // C

  // D

  // E

  // F
  "Facebook",

  // G

  // H

  // I
  "Instagram",

  // J

  // K

  // L
  "LinkedIn",

  // M
  "MixCloud",

  // N

  // O

  // P

  // Q

  // R

  // S
  "SoundCloud",
  "Spotify Artist",
  "Spotify User",

  // T
  "Twitter",
  "Twitch",

  // U

  // V

  // W
  "Website",

  // X

  // Y
  "Youtube",
  // Z
];

/**
 *
 *
 *
 * ig - instagram
 * ln - linkedin
 * mc - mixcloud
 * fb - facebook
 * ttr - twitter
 * tw - twitch
 *
 */

// export const extractUrlId = (s) => {
//   let spltArr, spltArr2, splt1, splt2;

//   switch (true) {
//     // stripping Youtube
//     case s.includes("youtube.com/watch?v="):
//       splt1 = s.split("watch?v=");
//       if (splt1.length > 1) {
//         // setFormError(null);
//         return { source: "youtube", link: splt1[1].split("?")[0], title: "" };
//       }

//     // stripping Youtube
//     case s.includes("youtu.be"):
//       spltArr = s.split("/");
//       splt1 = spltArr[spltArr.length - 1];

//       // setFormError(null);
//       return { source: "youtube", link: splt1.split("?")[0], title: "" };

//     // stripping Twitch
//     case s.includes("twitch.tv"):
//       spltArr = s.split("/");
//       splt1 = spltArr[spltArr.length - 1];

//       // setFormError(null);
//       return { source: "twitch", link: splt1.split("?")[0], title: "" };

//     // stripping Mixlr
//     case s.includes("mixlr.com"):
//       spltArr = s.split("https://mixlr.com/users/");
//       splt1 = spltArr[spltArr.length - 1];
//       splt2 = splt1.split("/embed")[0];

//       // setFormError(null);
//       return { source: "mixlr", link: splt2, title: "" };

//     // stripping MixCloud widget
//     case s.includes("mixcloud.com/widget"):
//       spltArr = s.split("%2F");
//       splt1 = spltArr[1];
//       splt2 = spltArr[2];

//       // setFormError(null);
//       return { source: "mixcloud", link: `${splt1}%2F${splt2}%2F`, title: "" };

//     // stripping MixCloud url
//     case s.includes("mixcloud.com"):
//       spltArr = s.split("?");
//       spltArr2 = spltArr[0].split("/");

//       if (spltArr2[spltArr2.length - 1]) {
//         splt1 = spltArr2[spltArr2.length - 1];
//         splt2 = spltArr2[spltArr2.length - 2];
//       } else {
//         splt1 = spltArr2[spltArr2.length - 3];
//         splt2 = spltArr2[spltArr2.length - 2];
//       }

//       // setFormError(null);
//       return { source: "mixcloud", link: `${splt1}%2F${splt2}%2F`, title: "" };

//     default:
//       // setFormError(
//       //   "Something isn't right with this data, please copy it and try again"
//       // );
//       return { source: "website", link: trimURL(s), title: "" };
//   }
// };

// export const beatportTrim = (s) => {
//   const splitArr = getStringBeforeParams(s).split("/");

//   if (splitArr[splitArr.length - 1].length) {
//     return `${splitArr[splitArr.length - 2]}/${splitArr[splitArr.length - 1]}`;
//   } else {
//     return `${splitArr[splitArr.length - 3]}/${splitArr[splitArr.length - 2]}`;
//   }
// }; // https://www.beatport.com/chart/ + content

// export const facebookTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// }; // https://www.facebook.com/ + content

// export const instagramTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// }; // https://www.instagram.com/ + content

// export const linkedinTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// } // https://www.linkedin.com/in/

// export const mixCloudTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// }; // https://www.mixcloud.com/ + content

// export const soundCloudTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// } // https://soundcloud.com/

// export const spotifyTrim = (s) => {
//   return getLastSringAfterSlash(getStringBeforeParams(s).split("/"));
// }; // https://open.spotify.com/artist/
