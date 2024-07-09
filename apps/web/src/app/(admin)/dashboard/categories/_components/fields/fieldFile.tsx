import { useFormContext } from 'react-hook-form';

export default function FieldFile({ form, errorMessage, label, name }: { form: any; errorMessage?: string; label: string; name: string }) {
  const { register } = useFormContext();
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input type="file" {...register(name)} className="mt-1 block w-full" />
      {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
