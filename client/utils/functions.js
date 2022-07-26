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
