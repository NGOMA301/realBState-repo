import { Link } from "react-router-dom";

export const NavLink = ({
  to,
  children,
  isActive,
  className,
  activeClassName,
}) => (
  <Link
    to={to}
    className={`text-sm font-medium ${isActive ? activeClassName : className}`}
  >
    {children}
  </Link>
);
