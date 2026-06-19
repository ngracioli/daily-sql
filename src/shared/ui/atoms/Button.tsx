export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  children: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "transition-colors inline-flex items-center justify-center";
  let variantClasses = "";
  
  if (variant === "primary") {
    variantClasses = "bg-[#171717] text-white px-4 py-2 rounded-full text-label-sm font-label-sm font-medium hover:bg-black";
  } else if (variant === "secondary") {
    variantClasses = "bg-surface-container-highest text-primary px-4 py-2 rounded-full text-label-sm font-label-sm font-medium hover:bg-surface-container-high";
  } else if (variant === "ghost") {
    variantClasses = "text-secondary hover:text-primary px-4 py-2 rounded-full text-label-sm font-label-sm font-medium hover:bg-surface-container-high";
  } else if (variant === "icon") {
    variantClasses = "text-secondary hover:text-primary p-2 rounded-full hover:bg-surface-container-high";
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
