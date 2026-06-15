import { useAppStore } from '@/store/useStore';

export const Toast = () => {
  const toast = useAppStore((s) => s.toast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-gray-900/90 text-white px-5 py-2.5 rounded-full text-sm shadow-lg animate-[fadeInUp_0.2s_ease-out]">
        {toast.message}
      </div>
    </div>
  );
};
