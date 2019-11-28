import moment from "moment";

const getDate = (date: string) => {
  const momentDate = moment(date);
  const time = momentDate.format("hh:mma");
  const dateFrom = momentDate.from(moment());
  const displayDate =
    date && dateFrom !== "Invalid date" ? dateFrom : undefined;
  return displayDate ? `${displayDate} at ${time}` : "Never";
};

export default getDate;
