import { useSelector } from "react-redux";
import FolderCard from "./FolderCard";
import "./folders.css";

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
    <div className="mlGrid">
      {year.monthsEnabled.map((m) => (
        <FolderCard
          key={m}
          title={MONTHS[m - 1]}
          subtitle={String(year.year)}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
