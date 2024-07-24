interface IProps {
  type: string;
  value?: string;
  placeholder: string;
  onChange: Function;
}

const Input = (props: IProps) => {
  return (
    <input
      className="input"
      value={props.value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    ></input>
  );
};

export default Input;
