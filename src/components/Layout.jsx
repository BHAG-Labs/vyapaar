import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/profile', label: 'Profile' },
];

export default function Layout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-surface-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand">V</span>
            <span className="text-xl font-semibold text-slate-100">Vyapaar</span>
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-brand-light' : 'text-slate-400 hover:text-slate-200'}`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="flex items-center gap-3 border-l border-surface-border pl-6">
              <span className="text-sm text-slate-400">{profile?.full_name || 'User'}</span>
              <button
                onClick={signOut}
                className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
