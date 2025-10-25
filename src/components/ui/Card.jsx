import { cn } from '../../lib/utils';

const Card = ({
  children,
  variant = 'glass',
  hover = true,
  className,
  ...props
}) => {
  const variants = {
    glass: hover ? 'glass-card-hover' : 'glass-card',
    neuro: 'neuro-card',
    solid: 'bg-white shadow-soft-lg rounded-3xl',
  };

  return (
    <div
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
};

export default Card;
