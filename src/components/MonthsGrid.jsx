import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
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
  const [, setSearchParams] = useSearchParams();

  if (!year) return null;

  return (
    <div className="mlGrid">
      {year.monthsEnabled.map((m) => (
        <FolderCard
          key={m}
          title={MONTHS[m - 1]}
          subtitle={String(year.year)}
          onClick={() => setSearchParams({ year: String(year.year), month: String(m) })}
        />
      ))}
    </div>
  );
}
