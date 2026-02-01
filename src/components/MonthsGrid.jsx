import { useSelector } from "react-redux";

const MONTHS = [
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

export default function MonthsGrid() {
  const year = useSelector((state) => state.years.selectedYear);

  if (!year) return null;

  return (
    <div className="grid">
      {year.monthsEnabled.map((m) => (
        <div key={m} className="folder">
          📁
          <div>{MONTHS[m - 1]}</div>
          <small>{year.year}</small>
        </div>
      ))}
    </div>
  );
}
