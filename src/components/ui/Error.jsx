import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="rounded-full bg-error-50 p-3 mb-4">
        <ApperIcon 
          name="AlertTriangle" 
          className="h-6 w-6 text-error-500" 
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;