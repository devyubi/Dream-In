import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

function QuantumSpinner() {
  return (
    <div
      style={{
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        marginTop: `20px`,
      }}
    >
      <Quantum size="90" speed="3.5" color="rgb(197, 71, 255)" />
    </div>
  );
}

export default QuantumSpinner;
