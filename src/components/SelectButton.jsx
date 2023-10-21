const SelectButton = ({ children, selected, onClick }) => {
  return (
    <span
      onClick={onClick}
      className="selectbutton"
      style={{
        backgroundColor: selected ? "gold" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? 700 : 500,
      }}
    >
      {children}
    </span>
  );
};

export default SelectButton;
