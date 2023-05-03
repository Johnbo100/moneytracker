import React, { useState } from "react";
import { useEffect } from "react";

export const Rates = () => {
  const [rates, setRates] = useState(0);
  const [altrates, setAltrates] = useState(0);
  const [result, setResult] = useState(0);

  const getrates = () => {
    fetch("https://api.exchangerate.host/convert?from=GBP&to=THB")
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        // Examine the text in the response
        response.json().then(function(d) {
          setRates(d.result);
        });
      })
      .catch(function(err) {
        console.log("Fetch Error :-S", err);
      });

    fetch("https://api.exchangerate.host/convert?from=THB&to=GBP")
      .then(function(resp) {
        if (resp.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + resp.status
          );
          return;
        }

        // Examine the text in the response
        resp.json().then(function(d) {
          setAltrates(d.result);
        });
      })
      .catch(function(err) {
        console.log("Fetch Error :-S", err);
      });
  };

  useEffect(() => {
    getrates();
  }, []);

  const convert = (mtype, val) => {
    mtype === "gbp" ? setResult(val * rates) : setResult(val * altrates);
  };

  return (
    <div>
      <div>
        Todays rates 1 pound ={rates} - 1000 baht costs:{altrates * 1000}
      </div>
      <div>
        If rates 42.5 1000 baht costs {0.023 * 1000}-Result=
        {0.023 * 1000 - altrates * 1000}
      </div>
      <div className="qconvert">
        <div>
          GBP
          <input
            type="number"
            onChange={e => {
              convert("gbp", e.target.value);
            }}
          />
          BHT
          <input
            type="number"
            onChange={e => {
              convert("bht", e.target.value);
            }}
          />
          {result}
        </div>
      </div>
    </div>
  );
};
