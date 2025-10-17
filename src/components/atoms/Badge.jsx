import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    lead: "bg-blue-100 text-blue-800",
    negotiation: "bg-yellow-100 text-yellow-800", 
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;