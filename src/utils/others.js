// export function calcGeoDistance(post, cb) {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         ({ coords: { latitude: lat, longitude: lng } }) => {

//           cb(
//             calcDistance(
//               lat,
//               lng,
//               post._geoloc.lat,
//               post._geoloc.lng,
//               "K"
//             ).toFixed(1)
//           );
//         }
//       );
//     } else {
//       cb(0);
//     }
// }

export const renderGoogleLink = (start, end, title, link) => {
  const timeOffset = `${new Date().getTimezoneOffset()}`;

  const hourOffset = parseInt(timeOffset.split(".")[0], 10) / 60;
  const minuteOffset = timeOffset.split(".")[1]
    ? parseInt(timeOffset.split(".")[1], 10) / 60
    : 0;

  const startYear = start.getYear() + 1900;

  const startMonth =
    start.getMonth() + 1 > 9
      ? `${start.getMonth() + 1}`
      : `0${start.getMonth() + 1}`;

  const startDay =
    start.getDate() > 9 ? `${start.getDate()}` : `0${start.getDate()}`;

  const startHour =
    start.getHours() + hourOffset > 9
      ? `${start.getHours() + hourOffset}`
      : `0${start.getHours() + hourOffset}`;

  const startMinute =
    start.getMinutes() + minuteOffset > 9
      ? `${start.getMinutes() + minuteOffset}`
      : `0${start.getMinutes() + minuteOffset}`;

  console.log("this link", startHour);
  console.log("this link", startMinute);

  const endYear = end.getYear() + 1900;
  const endMonth =
    end.getMonth() + 1 > 9 ? `${end.getMonth() + 1}` : `0${end.getMonth() + 1}`;

  const endDay = end.getDate() > 9 ? `${end.getDate()}` : `0${end.getDate()}`;
  const endHour =
    end.getHours() + hourOffset > 9
      ? `${end.getHours() + hourOffset}`
      : `0${end.getHours() + hourOffset}`;

  const endMinute =
    end.getMinutes() + minuteOffset > 9
      ? `${end.getMinutes() + minuteOffset}`
      : `0${end.getMinutes() + minuteOffset}`;

  const details = `Join the party at ${link}`;

  const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${startYear}${startMonth}${startDay}T${startHour}${startMinute}00Z%2F${endYear}${endMonth}${endDay}T${endHour}${endMinute}00Z&text=${title}&details=${details}`;
  console.log("this link", googleLink);

  // const title = event.title.split(" ").join("%20");
  // %0A // this is how you create a line drop
  return googleLink;
};
