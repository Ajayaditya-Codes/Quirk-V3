const VariableButton: React.FC<{
  variable: string;
  onClick: () => void;
}> = ({ variable, onClick }) => (
  <button
    onClick={onClick}
    className="inline items-center p-1 m-1 text-sm font-medium px-2 tracking-wider justify-center w-fit rounded-xl border"
  >
    var::{variable}
  </button>
);

export default VariableButton;
