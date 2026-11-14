
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Code2, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-indigo-400" : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/90 backdrop-blur-xl">
      <nav className="page-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Code2 size={25} />
          </div>

          <div>
            <p className="font-heading text-xl font-bold tracking-tight text-white">
              Code-a-<span className="text-indigo-400">Nova</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Innovate. Build. Compete.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <UserRound size={17} />
                {user?.name?.split(" ")[0] || "Dashboard"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out of your account"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link to="/signup" className="primary-button !py-2.5">
                Register Now
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="rounded-lg border border-white/10 p-2 text-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-navy-950 px-5 py-5 md:hidden">
          <div className="page-container flex flex-col gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
              >
                {item.name}
              </NavLink>
            ))}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-semibold text-white"
                  >
                    My Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left text-sm text-red-300"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-300"
                  >
                    Login
                  </Link>

                  <Link to="/signup" className="primary-button">
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
