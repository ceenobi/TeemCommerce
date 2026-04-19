import { Button } from "./button";
import { Spinner } from "./spinner";

interface ActionButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
  text?: React.ReactNode;
  classname?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  form?: string;
  size?: "default" | "sm" | "lg";
}

export default function ActionButton({
  type,
  loading,
  text,
  classname,
  onClick,
  disabled,
  variant,
  form,
  size,
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`cursor-pointer transition-transform rounded duration-300 ease-in-out ${classname}`}
      variant={variant}
      form={form}
      size={size}
    >
      {loading && <Spinner data-icon="inline-start" />}
      {text}
    </Button>
  );
}
