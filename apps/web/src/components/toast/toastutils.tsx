import { toast } from '@/components/ui/sonner';

export const showSuccess = (message: string) => {
  toast.success(message, {
    className: 'bg-green-500 text-white',
  });
};

export const showError = (message: string, errorContent?: string) => {
  let errorMessage = message;
  if (errorContent) {
    errorMessage += `: ${errorContent}`;
  }
  
  toast.error(errorMessage, {
    className: 'bg-red-500 text-white',
  });
};
