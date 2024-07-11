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
    const { error: apiError, errors, fieldErrors } = error.response.data;

    if (fieldErrors && typeof fieldErrors === 'object') {
      const fieldErrorMessages = Object.values(fieldErrors).flat().join(', ');
      showError('Validation Error', fieldErrorMessages);
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
