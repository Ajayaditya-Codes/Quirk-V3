import React from "react";
export default function VariableButton({
  variable,
  onClick,
}: {
  variable: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline items-center p-1 m-1 text-sm font-medium px-2 tracking-wider justify-center w-fit rounded-xl border"
    >
      var::{variable}
    </button>
  );
}
