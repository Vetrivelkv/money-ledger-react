import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchYears } from "../store/yearsSlice";
import FolderCard from "./FolderCard";
import "./folders.css";

export default function YearsGrid({ onPickYear }) {
  const dispatch = useDispatch();
  const years = useSelector((state) => state?.years?.list ?? []);

  useEffect(() => {
    if (!years?.length) dispatch(fetchYears());
  }, []);

  return (
    <div className="mlGrid">
      {years.map((y) => (
        <FolderCard
          key={y.year}
          title={String(y.year)}
          subtitle="Year"
          onClick={() => onPickYear(y)}
        />
      ))}
    </div>
  );
}
