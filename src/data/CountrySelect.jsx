import countryList from "react-select-country-list";
import Select from "react-select";

const CountrySelect = ({ value, onChange }) => {
  const options = countryList().getData();
  return (
    <Select
      options={options}
      value={options.find((c) => c.label === value)}
      onChange={(selected) => onChange(selected.label)}
      placeholder="Select Country"
      isSearchable
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "rgba(255,255,255,0.8)",
          borderRadius: "12px",
          borderColor: state.isFocused ? "#60A5FA" : "rgba(255,255,255,0.4)",
          boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
          padding: "2px",
        }),

        menu: (base) => ({
          ...base,
          borderRadius: "12px",
          overflow: "hidden",
        }),

        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#DBEAFE" : "white",
          color: "black",
          cursor: "pointer",
        }),

        singleValue: (base) => ({
          ...base,
          color: "#1f2937",
        }),
      }}
    />
  );
};
export default CountrySelect;
