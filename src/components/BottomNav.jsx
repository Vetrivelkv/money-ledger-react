import { useDispatch } from "react-redux";
import { setView } from "../store/uiSlice";

export default function BottomNav() {
  const dispatch = useDispatch();

  return (
    <div className="bottom-nav">
      <button onClick={() => dispatch(setView("YEARS"))}>Years</button>
      <button disabled>Expenses</button>
      <button disabled>Balance</button>
    </div>
  );
}
