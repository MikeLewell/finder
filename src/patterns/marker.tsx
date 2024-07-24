const Marker = ({ text, color }: { text: string; color?: string }) => {
  return (
    <div
      style={{
        height: "40px",
        width: "40px",
        borderRadius: "50%",
        backgroundColor: color || "rgb(215, 92, 113)",
        border: "3px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "17px",
        }}
      >
        {text}
      </div>
    </div>
  );
};
export default Marker;
