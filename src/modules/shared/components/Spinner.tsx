import { ImSpinner11 } from "react-icons/im";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <ImSpinner11
        size={50}
        style={{ animationDuration: "2s" }}
        className="animate-spin text-slate-400"
      />
    </div>
  );
}

export default Spinner;
