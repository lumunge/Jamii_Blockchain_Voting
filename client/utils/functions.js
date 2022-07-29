export const convert_time = (unix_time) => {
  let dte = new Date(unix_time * 1000);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = dte.getFullYear();
  let month = months[dte.getMonth()];
  let date = dte.getDate();
  let hour = dte.getHours();
  let min = dte.getMinutes();
  let sec = dte.getSeconds();
  let time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const convert_time_unix = (date_str) => {
  const date = new Date(date_str);
  const unix_time = Math.floor(date.getTime() / 1000);
  return unix_time;
};
