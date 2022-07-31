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

export const url_format = (_url, _ballot_id) => {
  let res = _url.replace("[ballot_id]", _ballot_id);
  return res;
};

export const url_format_reg = (_url, _ballot_id) => {
  let res = _url.replace("register_voter", "vote");
  let res1 = res.replace("[ballot_id]", _ballot_id);
  return res1;
};

export const ballot_types_map = new Map([
  [0, "open"],
  [1, "closed"],
  [2, "open_secret"],
  [3, "closed_secret"],
]);

export const nav_items_map = new Map([
  ["Use Cases", "/use_cases"],
  ["Success Stories", "/sucess_stories"],
  ["Help Center", "/help_center"],
  ["Blog", "/blog"],
]);
