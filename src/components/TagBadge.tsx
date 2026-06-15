import { getTagColorClass } from '@/utils/helpers';
import { TagType } from '@/types';

interface TagBadgeProps {
  text: string;
  type?: TagType;
  small?: boolean;
}

export const TagBadge = ({ text, type = 'gray', small = false }: TagBadgeProps) => {
  const base = 'inline-flex items-center border rounded-full font-medium transition-all';
  const sizeClass = small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const colorClass = getTagColorClass(type);

  return <span className={`${base} ${sizeClass} ${colorClass}`}>{text}</span>;
};
