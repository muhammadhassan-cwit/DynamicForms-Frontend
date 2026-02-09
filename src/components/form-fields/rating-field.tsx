'use client';

import { FormField } from '@/types';
import FieldWrapper from './field-wrapper';

interface RatingFieldProps {
  field: FormField;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function RatingField({ field, value, onChange, error }: RatingFieldProps) {
  const rating = value || 0;

  return (
    <FieldWrapper field={field} error={error}>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-3xl focus:outline-none transition-colors"
          >
            <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-gray-500 mt-1">{rating} out of 5</p>
      )}
    </FieldWrapper>
  );
}