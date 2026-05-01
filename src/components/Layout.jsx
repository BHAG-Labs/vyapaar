import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/marketplace', label: 'AI Agents' },
  { to: '/profile', label: 'Profile' },
];

const linkCls = ({ isActive }) =>
  `text-xs uppercase tracking-[0.15em] transition-colors ${
    isActive ? 'text-terracotta border-b-2 border-terracotta pb-1' : 'text-charcoal/70 hover:text-charcoal'
  }`;

export default function Layout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <nav className="sticky top-0 z-40 glass-nav">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2.5 leading-none">
            <img src="/logo-mark.svg" alt="" className="h-8 w-8" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="font-heading font-bold text-xl text-charcoal tracking-tight">Yantra</span>
              <span className="text-[10px] text-charcoal/50 font-subheading">by BHAG Labs</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkCls}>{label}</NavLink>
            ))}

            <div className="flex items-center gap-4 border-l border-charcoal/20 pl-6">
              <span className="hidden sm:inline text-xs text-charcoal/50">{profile?.full_name || 'User'}</span>
              <button
                onClick={signOut}
                className="text-xs uppercase tracking-[0.15em] text-charcoal/70 hover:text-terracotta transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
