import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  color?: string;
  readOnly?: boolean;
}

export const StarRating = ({ value, onChange, size = 16, color = 'text-amber-400', readOnly = false }: StarRatingProps) => {
  const handleClick = (i: number) => {
    if (readOnly || !onChange) return;
    onChange(i + 1);
  };

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90'} transition-transform p-0.5`}
            disabled={readOnly}
          >
            <Star
              size={size}
              className={`${filled ? `${color} fill-current` : 'text-gray-300'} transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
