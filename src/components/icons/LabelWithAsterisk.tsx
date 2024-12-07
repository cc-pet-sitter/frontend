const LabelWithAsterisk: React.FC<{ text: string; required?: boolean }> = ({
  text,
  required = false,
}) => (
  <label className="block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg">
    {text}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default LabelWithAsterisk;
