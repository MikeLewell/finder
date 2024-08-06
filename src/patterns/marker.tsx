interface IProps {
  text: string;
  color?: string;
}

const Marker: React.FC<IProps> = ({ text, color }) => {
  return (
    <div
      style={{
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        backgroundColor: color || "transparent",
        border: "3px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        {text}
      </span>
    </div>
  );
};
export default Marker;
