export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export function Icon({ name, className = "", ...props }: IconProps) {
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      data-icon={name} 
      {...props}
    >
      {name}
    </span>
  );
}
