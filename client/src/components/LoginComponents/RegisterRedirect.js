import { Link } from "react-router-dom";

const RegisterRedirect = ({ textBefore, linkText, to }) => {
  return (
    <div className="text-center mt-3">
      <p className="text-muted">
        {textBefore}{" "}
        <Link to={to} className="text-success fw-semibold text-decoration-none">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default RegisterRedirect;
