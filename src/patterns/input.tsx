interface IProps {
  type: string;
  placeholder: string;
  onChange: Function;
}

const Input = (props: IProps) => {
  return (
    <input
      className="input"
      type={props.type}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    ></input>
  );
};

export default Input;
