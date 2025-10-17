import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({
  label,
  error,
  type = "input",
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {type === "input" && <Input error={error} {...props} />}
      {type === "select" && <Select error={error} {...props}>{children}</Select>}
      {type === "textarea" && (
        <textarea
          className={cn(
            "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none",
            error && "border-error-500 focus:ring-error-500"
          )}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;