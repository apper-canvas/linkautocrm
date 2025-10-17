import { cn } from "@/utils/cn";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Button from "@/components/atoms/Button";

const Header = ({ 
  title, 
  action, 
  actionLabel, 
  onAction,
  className 
}) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MobileSidebar />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {action && actionLabel && onAction && (
          <Button onClick={onAction} icon="Plus">
            {actionLabel}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;