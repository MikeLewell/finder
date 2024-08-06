interface IProps {
  type: string;
  value?: string;
  placeholder: string;
  onChange: Function;
}

const Input: React.FC<IProps> = ({ type, value, placeholder, onChange }) => {
  return (
    <input
      className="input"
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Input;
