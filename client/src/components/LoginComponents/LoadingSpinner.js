import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ size = "sm", className = "" }) => {
  return (
    <Spinner
      animation="border"
      size={size}
      role="status"
      className={`me-2 ${className}`}
    />
  );
};

export default LoadingSpinner;
