import { useState, useEffect, useRef } from "react";
import useDebounce from "./helpfunc/custom-hook/UseDebounce";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const inputRef = useRef(null);
  const debounceValue = useDebounce(value, 500);
  const [singleSelectMode, setSingleSelectMode] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleItemChange = (event, item) => {
    if (singleSelectMode) {
      // Handle single select mode
      setSelectedOptions([item]);
    } else {
      // Handle multiple select mode
      if (event.target.checked) {
        if (selectedOptions.length < 5) {
          const selected = [...selectedOptions, item];
          setSelectedOptions(selected);
          setValue("");
        } else {
          setValue("");
          setError("Maximum of 5 users can be selected");
        }
      } else {
        const updatedSelectedOptions = selectedOptions.filter(
          (selectedItem) => selectedItem.name !== item.name
        );
        setSelectedOptions(updatedSelectedOptions);
        setValue("");
        setError("");
      }
    }
  };

  const toggleSelectMode = () => {
    setSingleSelectMode(!singleSelectMode);
  };

  useEffect(() => {
    if (selectedOptions.length < 5) inputRef.current.focus();
  }, [selectedOptions]);

  useEffect(() => {
    if (debounceValue.length > 0) {
      setLoader(true);
      fetch(`https://swapi.dev/api/people/?search=${value} `)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setData(data.results);
          setLoader(false);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [debounceValue]);

  return (
    <div className="multiple-search-container">
      <h1 className="header">Select Search</h1>
      <div className="search-container-wrapper">
        <div className="search-container">
          {selectedOptions.map((item) => (
            <div className="card" key={item.name}>
              <div className="selected-item"> {item.name}</div>
              <div
                className="cancel-selected-item"
                onClick={() => {
                  setSelectedOptions([]);
                  setValue("");
                }}
              >
                &times;
              </div>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="search-auto-complete"
            name="search"
            id="search"
            placeholder="search auto complete"
            value={value}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <button onClick={toggleSelectMode}>Toggle Select Mode</button>
      </div>
      {error && <small className="error">{error}</small>}

      {loader && (
        <div className="option-box">
          <div className="option-box-item">Loading ...</div>
        </div>
      )}
      {!loader && data.length > 0 ? (
        <div className="option-box">
          {data.map((result, i) => (
            <div className="option-box-item" key={result.name}>
              <input
                type={singleSelectMode ? "radio" : "checkbox"}
                name={singleSelectMode ? "radio-group" : "checkbox-group"}
                id={i}
                onChange={(e) => handleItemChange(e, result)}
                value={result.name}
                checked={
                  selectedOptions.some(
                    (selectedItem) => selectedItem.name === result.name
                  ) && !singleSelectMode
                }
              />
              <label htmlFor={i}>{result.name}</label>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default App;
