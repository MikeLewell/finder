interface IProps {
  buttonText: string;
  disabled: boolean;
  onClick: Function;
}

const Button = (props: IProps) => {
  return (
    <button
      className="button"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      {props.buttonText}
    </button>
  );
};

export default Button;
