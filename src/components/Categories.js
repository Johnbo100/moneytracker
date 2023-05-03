import Axios from "axios";
import React, { useState } from "react";

function Categories() {
  const [cat, setCat] = useState("");
  const [catadd, setCatadd] = useState("");

  const addCat = async () => {
    setCatadd("Adding new category.....");
    await Axios.post(process.env.REACT_APP_ADDCAT, { cat: cat })
      .then(response => {
        console.log("New category added");
      })
      .catch(error => console.log(error));
    setCatadd("New category added");
  };

  const handleChange = event => {
    setCat(event.target.value);
    console.log("value is:", event.target.value);
  };

  return (
    <div className="newcat">
      <div>Add new category:</div>
      <input onChange={handleChange} />
      <button onClick={addCat}>Add new category</button>
      {catadd}
    </div>
  );
}

export default Categories;
