import React, { useState, createContext, useContext, useEffect } from "react";
import "./App.css";
import Title from "./components/Title";
import Main from "./components/Main";
import Breakdown from "./components/Breakdown";
import Categories from "./components/Categories";
import { Rates } from "./components/Rates";
import axios from "axios";

const DataContext = createContext();

function App() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    async function getdata() {
      await axios
        .get(process.env.REACT_APP_ALLDATA)
        .then((response) => {
          setRecords(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, []);
  return (
    <div className="App">
      <DataContext.Provider value={records}>
        <Title />
        <Rates />
        <Categories />
        <Main />
        <Breakdown />
      </DataContext.Provider>
    </div>
  );
}

export default App;
