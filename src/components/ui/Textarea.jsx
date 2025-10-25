import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  className,
  floating = false,
  rows = 4,
  ...props
}, ref) => {
  if (floating) {
    return (
      <div className="relative mt-6">
        <textarea
          ref={ref}
          rows={rows}
          placeholder=" "
          className={cn('input-modern resize-none peer', className)}
          {...props}
        />
        {label && (
          <label className="absolute left-6 -top-3 bg-gradient-to-r from-cream-50 to-autumn-50 px-2 text-sm font-medium text-autumn-600 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-autumn-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-autumn-600">
            {label}
          </label>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-autumn-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn('input-modern resize-none', className)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
