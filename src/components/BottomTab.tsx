import { NavLink } from 'react-router-dom';
import { Home, GitCompare, User, Dices } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: '选课广场' },
  { path: '/compare', icon: GitCompare, label: '课程对比' },
  { path: '/game', icon: Dices, label: '大富翁' },
  { path: '/mine', icon: User, label: '我的' },
];

export const BottomTab = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2.5 px-4 min-w-[72px] transition-all ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
