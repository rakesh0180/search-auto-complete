import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };
  useEffect(() => {
    if (value.length > 0) {
      console.log("🚀 ~ file: App.jsx:13 ~ useEffect ~ value:", value);
      fetch(`https://swapi.dev/api/people/?search=${value} `)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("data", data);
          setData(data.results);
        })
        .catch((err) => {
          console.log("🚀 ~ file: App.jsx:16 ~ fetch ~ err:", err);
        });
    }
  }, [value]);

  return (
    <div className="multiple-search-container">
      <h1>Multi-Select Search</h1>
      <div className="search-container">
        <input
          type="text"
          name="search-auto-complete"
          id="search"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="option-container">
        <ui>
          {data.map((item) => {
            return <li key={item.name}>{item.name}</li>;
          })}
        </ui>
      </div>
    </div>
  );
};

export default App;
