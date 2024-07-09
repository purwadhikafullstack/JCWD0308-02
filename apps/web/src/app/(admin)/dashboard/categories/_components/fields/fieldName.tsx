import { useFormContext } from 'react-hook-form';

export default function FieldName({ form, errorMessage }: { form: any; errorMessage?: string }) {
  const { register } = useFormContext();
  return (
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
      <input id="name" {...register('name')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
