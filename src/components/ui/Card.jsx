import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(({
  children,
  variant = 'glass',
  hover = true,
  className,
  ...props
}, ref) => {
  const variants = {
    glass: hover ? 'glass-card-hover' : 'glass-card',
    neuro: 'neuro-card',
    solid: 'bg-white shadow-soft-lg rounded-3xl',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'p-6',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
