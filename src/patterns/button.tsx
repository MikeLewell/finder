interface IProps {
  buttonText: string;
  type?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: Function;
}

const Button: React.FC<IProps> = ({
  buttonText,
  type = "primary",
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`button button--${type}`}
      disabled={disabled}
      onClick={() => onClick && onClick()}
    >
      {buttonText}
    </button>
  );
};

export default Button;
