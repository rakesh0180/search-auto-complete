import { useState, useEffect, useRef } from "react";
import useDebounce from "./helpfunc/custom-hook/UseDebounce";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [value, setValue] = useState("");
  const [isApicall, setIsApicall] = useState(false);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const inputRef = useRef(null);
  const debounceValue = useDebounce(value, 500);
  const controller = new AbortController(); // Create an AbortController
  const signal = controller.signal; // Get the controller's signal

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsApicall(false);
  };

  /**
   * Handle changes when a checkbox is selected or deselected.
   * @param {Event} event - The checkbox change event.
   * @param {Object} item - The item associated with the checkbox.
   */
  const handleItemChange = (event, item) => {
    // Check if the checkbox is checked
    if (event.target.checked) {
      // If selectedOptions length is less than 5, add the item to the selectedOptions
      if (selectedOptions.length < 5) {
        const selected = [...selectedOptions, item];
        setSelectedOptions(selected);
        setValue("");
      } else {
        // Handle case when maximum selection limit is reached
        setValue("");
        setError("Maximum of 5 users can be selected");
      }
    } else {
      // If the checkbox is deselected, remove the item from selectedOptions
      const updatedSelectedOptions = selectedOptions.filter(
        (selectedItem) => selectedItem.name !== item.name
      );
      setSelectedOptions(updatedSelectedOptions);
      setValue("");
      setError("");
    }
  };

  /**
   * Remove a single selected item from the list of selected options.
   * @param {string} item - The name of the item to be removed.
   */
  const removeSingleSelectedItem = (item) => {
    const removeItem = selectedOptions.filter(
      (selectedItem) => selectedItem.name !== item
    );
    setSelectedOptions(removeItem);
    setValue("");
    setError("");
  };

  useEffect(() => {
    if (selectedOptions.length < 5) inputRef.current.focus();
  }, [selectedOptions]);

  useEffect(() => {
    controller.abort();
    if (debounceValue.length > 0) {
      setIsApicall(false);
      setLoader(true);
      //   controller = new AbortController(); // Create a new controller
      //   const signal = controller.signal; // Get the new controller's signal
      fetch(`https://swapi.dev/api/people/?search=${value} `)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const apiData = data;
          setData(apiData.results);
          setLoader(false);
          setIsApicall(true);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [debounceValue]);

  return (
    <div className="multiple-search-container">
      <h1 className="header">Multi-Select Search</h1>
      <div className="search-container-wrapper">
        <div className="search-container">
          {selectedOptions.map((item) => {
            return (
              <div className="card" key={item.name}>
                <>
                  <div className="selected-item"> {item.name}</div>
                  <div
                    className="cancel-selected-item"
                    onClick={() => {
                      removeSingleSelectedItem(item.name);
                    }}
                  >
                    &times;
                  </div>
                </>
              </div>
            );
          })}
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
      </div>
      {error && <small className="error">{error}</small>}

      {loader && (
        <div className="option-box">
          <div className="option-box-item">Loading ...</div>
        </div>
      )}
      {data.length === 0 && isApicall && (
        <div className="option-box">
          <label className="option-box-item">No Users Found</label>
        </div>
      )}
      {!loader && data.length > 0 ? (
        <div className="option-box">
          {data.map((result, i) => (
            <div className="option-box-item" key={result.name}>
              <input
                type="checkbox"
                name={result.name}
                id={i}
                onChange={(e) => handleItemChange(e, result)}
                value={result.name}
                checked={selectedOptions.some(
                  (selectedItem) => selectedItem.name === result.name
                )}
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
