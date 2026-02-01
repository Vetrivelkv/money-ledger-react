import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchYears, selectYear } from "../store/yearsSlice";
import { setView } from "../store/uiSlice";

export default function YearsGrid() {
  const dispatch = useDispatch();
  const years = useSelector((state) => state?.years?.list ?? []);

  useEffect(() => {
    if (!years?.length) dispatch(fetchYears());
  }, []);

  return (
    <div className="grid">
      {years.map((y) => (
        <button
          key={y.year}
          className="folder"
          onClick={() => {
            dispatch(selectYear(y));
            dispatch(setView("MONTHS"));
          }}
        >
          📁
          <div>{y.year}</div>
        </button>
      ))}
    </div>
  );
}
