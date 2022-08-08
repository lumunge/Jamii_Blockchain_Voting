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

export const convert_seconds = (seconds) => {
  if (seconds < 0) {
    return false;
  }

  const days = Math.floor(seconds / (3600 * 24));

  seconds -= days * 3600 * 24;

  const hours = Math.floor(seconds / 3600);

  seconds -= hours * 3600;

  const mins = Math.floor(seconds / 60);

  seconds -= mins * 60;

  const tmp = [];

  days && tmp.push(days + "d");

  (days || hours) && tmp.push(hours + "h");

  (days || hours || mins) && tmp.push(mins + "m");

  tmp.push(Math.floor(seconds) + "s");

  return tmp.join(" ");
};

export const ballot_types_map = new Map([
  [0, "open"],
  [1, "closed"],
  [2, "open_secret"],
  [3, "closed_secret"],
]);

export const nav_items_map = new Map([
  ["Use Cases", "/use_cases"],
  ["Success Stories", "/success_stories"],
  ["Help Center", "/help_center"],
  ["Blog", "/blog"],
]);
