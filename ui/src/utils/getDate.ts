import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const getDate = (date: string) => {
  const newDate = dayjs.utc();
  const inputDate = dayjs.utc(date);
  const time = inputDate.format(`hh:mma`);
  const dateFrom = inputDate.from(newDate);
  const displayDate =
    date && dateFrom !== `Invalid date` ? dateFrom : undefined;

  return displayDate ? `${displayDate} at ${time}` : `Never`;
};

export default getDate;
