import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import moment from "moment";

function Main() {
  const [records, setRecords] = useState(null);
  const [spent, setSpent] = useState(0);
  const [day, setDay] = useState();
  const [status, setStatus] = useState("waiting");
  const [cat, setCat] = useState("test");
  const [newbalance, setNewbalance] = useState(0);
  const [category, setCategory] = useState([{}]);
  const [exreport, setExreport] = useState([{}]);
  const [gtotal, setGtotal] = useState(0);
  const [tdays, setTdays] = useState(0);
  const [added, setAdded] = useState(false);
  const [cattotal, setCattotal] = useState(null);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [datertotal, setDatertotal] = useState(0);

  useEffect(() => {
    getdata();
  }, [added]);

  useEffect(() => {
    getCat();
  }, []);

  async function getdata() {
    await axios
      .get(process.env.REACT_APP_ALLDATA)
      .then(response => {
        setRecords(response.data);

        setAdded(false);
      })
      .catch(error => console.log(error));
  }

  const totalbydaterange = () => {
    let startDate = new Date(startdate);
    let endDate = new Date(enddate);

    let total = 0;

    for (let i = 0; i < records.length; i++) {
      let transactionDate = new Date(records[i].date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        total += records[i].expense;
      }
    }
    setDatertotal(total);
  };

  async function newexpense() {
    setStatus("Adding new expense........");
    await axios
      .post(process.env.REACT_APP_ADDEXP, {
        ex: spent,
        date: day,
        cat: cat,
        bal: newbalance
      })
      .then(response => {
        setRecords(null);
      })
      .catch(error => console.log("Error when posting new expense" + error));
    setStatus("New expense added");
    setAdded(true);
  }

  const getCat = async () => {
    setStatus("Getting categories");
    await axios
      .get(process.env.REACT_APP_GETCAT)
      .then(response => {
        setCategory(response.data);
        setStatus("Categories loaded");
      })
      .catch(error => console.log(error));
  };
  const handleChangeCat = event => {
    setCat(event.target.value);
  };

  const getCatgroup = async () => {
    setStatus("Getting categories");
    await axios
      .get(process.env.REACT_APP_TOTALBYCAT)
      .then(response => {
        setCattotal(response.data);
        setStatus("");
      })
      .catch(error => console.log(error));
  };

  const report = () => {
    var sum = 0;
    var prevdate = records[0].date;
    var lastid = records[records.length - 1].id;
    var store = [];
    var grandtotal = 0;
    var daycount = 1;

    records.forEach(subData => {
      if (prevdate == subData.date) {
        sum += subData.expense;
        if (subData.id === lastid) {
          store.push({ date: prevdate, total: sum });
        }
      } else {
        grandtotal += sum;
        daycount++;

        store.push({ date: prevdate, total: sum });
        prevdate = subData.date;

        sum = 0;
        sum += subData.expense;
      }
    });
    setExreport(store);
    setGtotal(grandtotal);
    setTdays(daycount);
  };

  const formatdate = tickFormat => {
    return tickFormat.substring(0, 10);
  };

  return (
    <div className="container">
      <div className="spent">
        <div className="space">
          <label>Spent(THB)</label>
          <input
            onChange={e => {
              setSpent(e.target.value);
            }}
            type="number"
          />
        </div>
        <div className="space">
          <label>Date</label>
          <input
            onChange={e => {
              setDay(e.target.value);
            }}
            type="date"
          />
        </div>
        <div className="space">
          <label>Category</label>
          <select name="category" onChange={handleChangeCat}>
            <option>Select category</option>
            {category.map((val, key) => (
              <option>{val.catname}</option>
            ))}
          </select>
        </div>

        <div className="space">
          <button onClick={newexpense}>Add expenditure</button>
          <div className="status">{status}</div>
        </div>
      </div>
      <div className="space">
        From date
        <input type="date" onChange={e => setStartdate(e.target.value)} />
        to date
        <input type="date" onChange={e => setEnddate(e.target.value)} />
        <button onClick={totalbydaterange}>Get total by date range</button>
        {datertotal}
      </div>
      <div>
        <button className="reportbtn" onClick={report}>
          Total expenses
        </button>
        <button className="reportbtn" onClick={getCatgroup}>
          Total by category
        </button>
      </div>
      <div className="gtotal">
        {" "}
        Grand total = baht:<span className="nums">{gtotal}</span>gbp:
        <span className="nums">{gtotal * 0.023}</span>in{" "}
        <span className="nums">{tdays}</span>days
      </div>
      <div className="gtotal">
        {" "}
        Predicted 1 month:<span className="nums">
          {(gtotal / tdays) * 30}
        </span>{" "}
        gbp:<span className="nums">{(gtotal / tdays) * 30 * 0.023}</span>
      </div>

      <ResponsiveContainer width={"100%"} aspect={1}>
        <ComposedChart
          layout="vertical"
          width={500}
          height={500}
          data={exreport}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" domain={[80, 8000]} />
          <YAxis
            dataKey="date"
            tickFormatter={tick => formatdate(tick)}
            type={"category"}
            scale="band"
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          <Legend />

          <Bar dataKey="total" barSize={20} fill="#f8ab8f" />
        </ComposedChart>
      </ResponsiveContainer>
      {exreport.map(s => {
        return (
          <div className="exreport">
            Date
            <input placeholder={s.date} />
            BHT
            <input placeholder={s.total} />
            GBP
            <input placeholder={s.total * 0.023} />
          </div>
        );
      })}

      {records !== null &&
        records.map(s => {
          return (
            <div className="breakdown">
              Date
              <input placeholder={s.date} />
              B<input placeholder={s.expense} />
              {"\u00A3"}
              <input placeholder={s.expense * 0.023} />
              <input placeholder={s.category} />
              Bl
              <input placeholder={s.balance} />
            </div>
          );
        })}
      <ResponsiveContainer width={"100%"} aspect={1}>
        <ComposedChart
          layout="vertical"
          width={500}
          height={500}
          data={cattotal}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" domain={[80, 8000]} />
          <YAxis
            dataKey="category"
            type="name"
            scale="band"
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          <Legend />

          <Bar dataKey="sum" barSize={20} fill="#f8ab8f" />
        </ComposedChart>
      </ResponsiveContainer>
      {cattotal !== null &&
        cattotal.map(t => {
          return (
            <div className="breakdown">
              Cat
              <input placeholder={t.category} />
              Total
              <input placeholder={t.sum} />
              {"\u00A3"}
              <input placeholder={t.sum * 0.023} />
            </div>
          );
        })}

      <div className="space"></div>
    </div>
  );
}

export default Main;
