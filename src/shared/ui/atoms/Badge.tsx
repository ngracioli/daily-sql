export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "solid";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "default";
  children: React.ReactNode;
}

export function Badge({
  children,
  variant = "default",
  color = "default",
  className = "",
  ...props
}: BadgeProps) {
  const baseClasses = "px-2 py-1 rounded-full text-label-sm font-label-sm inline-flex items-center justify-center whitespace-nowrap";
  
  let variantClasses = "";
  if (variant === "default") {
    if (color === "default") variantClasses = "bg-surface-container-highest text-primary";
    else if (color === "success") variantClasses = "bg-green-100 text-green-800";
    else if (color === "error") variantClasses = "bg-error-container text-on-error-container";
  } else if (variant === "outline") {
    variantClasses = "bg-[#fafafa] text-[#171717] border border-[#ebebeb]";
  } else if (variant === "solid") {
    variantClasses = "bg-primary text-on-primary";
  }

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  );
}
