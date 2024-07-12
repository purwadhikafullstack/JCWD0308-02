import { toast } from '@/components/ui/sonner';

export const showSuccess = (message: string) => {
  toast.success(message, {
    className: 'text-green-500',
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

export const handleApiError = (error: any, defaultMessage: string = 'An unexpected error occurred') => {
  if (error.response && error.response.data) {
    const { error: apiError, errors } = error.response.data;

    if (errors && errors.fieldErrors && typeof errors.fieldErrors === 'object') {
      const firstFieldErrorKey = Object.keys(errors.fieldErrors)[0];
      const firstFieldErrorMessages = errors.fieldErrors[firstFieldErrorKey];
      const firstFieldErrorMessage = Array.isArray(firstFieldErrorMessages) ? firstFieldErrorMessages[0] : firstFieldErrorMessages;
      
      if (typeof firstFieldErrorMessage === 'string') {
        showError('Validation Error', firstFieldErrorMessage);
      } else {
        showError(defaultMessage);
      }
    } else if (apiError) {
      showError(defaultMessage, apiError);
    } else {
      showError(defaultMessage);
    }
  } else {
    console.error('Error:', error);
    showError(defaultMessage);
  }
};
