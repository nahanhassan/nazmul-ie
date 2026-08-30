import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [gmt, setGmt] = useState("Knit");
  const [qty, setQty] = useState("");
  const [smv, setSmv] = useState("");
  const [mp, setMp] = useState("");
  const [lead, setLead] = useState("");
  const [result, setResult] = useState("");

  const calEff = () => {
    if (
      qty === "" ||
      smv === "" ||
      mp === "" ||
      lead === "" ||
      qty <= 0 ||
      smv <= 0 ||
      mp <= 0 ||
      lead <= 0
    ) {
      setResult("⚠️ Please Check Inputs");
      return;
    }

    if (!Number.isInteger(qty) || !Number.isInteger(mp)) {
      setResult("❌ Order Quantity and Manpower must be whole numbers");
      return;
      }

        const lCurve = {
        vb_1: [40, 50, 60, 70, 75, 75, 75, 80, 80, 85],
        b_2: [30, 40, 50, 60, 70, 75, 75, 75, 80, 80],
        sc_1: [25, 35, 45, 55, 60, 65, 65, 70, 70, 75],
        sc_2: [20, 30, 40, 50, 55, 60, 60, 60, 65, 70],
        c_1: [15, 25, 35, 45, 55, 55, 60, 60, 60, 65],
        c_2: [15, 25, 35, 45, 55, 55, 55, 60, 60, 60],
        hc_1: [10, 20, 30, 40, 50, 50, 50, 55, 55, 60],
        hc_2: [10, 20, 30, 40, 50, 50, 50, 50, 55, 55],
  };

    const cat = (smv) => {
      if (smv <= 4.5) return "vb_1";
      if (smv <= 7.5) return "b_2";
      if (smv <= 11.5) return "sc_1";
      if (smv <= 15) return "sc_2";
      if (smv <= 18.5) return "c_1";
      if (smv <= 22) return "c_2";
      if (smv <= 25) return "hc_1";
      return "hc_2";
    };


    const hTarget = Math.round((600 * mp) / smv);
    const curve = lCurve[cat(smv)];

    let total = 0;
    let days = 0;
    const dailyProduction = [];

    while (total < qty) {
    const efficiency = curve[Math.min(days % lead, curve.length - 1)];
    const production = Math.round((efficiency * hTarget) / 100);

    const actual = Math.min(production, qty - total);
    dailyProduction.push(actual);
    days += 1;
    total += actual;
    }

    const lines = Math.ceil(Number(days / lead));
    const earnMinutes = qty * smv * 100;
    const qco = (gmt === "Woven" ? 55 : mp) * 5 * lines;
    const availableMinutes = (gmt === "Woven" ? 55 : mp) * 600 * days + qco;
    const eff = (earnMinutes / availableMinutes).toFixed(2);
    
    const tgt = Math.round((hTarget * eff) / 1000);
    const cpm = (0.06 / (eff / 100)).toFixed(4);    
    const cm = (smv * cpm).toFixed(2);
    const lCost = ((gmt === "Woven" ? 55 : mp) * 600 *0.06).toFixed(0);
    const tCost = lCost * days;
    const tRevenue = qty * cm;
    const profitLoss = tRevenue - tCost;

    setResult(
      <>
        📊 Efficiency: {eff}% <br />
        🎯 Target: {tgt} Pcs <br />
        💲 CPM ≥ ${cpm} <br />
        💰 CM ≥ ${cm} <br />
        💰 Days ≥ {days} Days <br />
        🪜 Line: {lines} Lines <br />
        🧩 Line Cost: ${lCost} <br />    
        🧩 Profit/Loss: ${profitLoss} <br />   
        🪜Ladder: {dailyProduction.slice(0, 100).join(" - ")        
      </>,
    );
  };

  //HTML form Starts-->

  return (
    <>
      <div className="container">
        <h3>اللّٰهُ أَكْبَرُ</h3>
        <h1> Pretty Group</h1>
        <div className="ticker-container">
          <h2 className="ticker">
            Pre-Costing Efficiency% Calculation | Nazmul N Hassan | Head of Industrial Engineering Department | &#169; 2024
          </h2>
        </div>
        <p>
          <i class="fas fa-industry"></i> Select Project:
        </p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gmt"
              value="Woven"
              checked={gmt === "Woven"}
              onChange={(e) => {
                const value = e.target.value;
                setGmt(value);

                if (value === "Woven") {
                  setMp(55); // set default once
                }
              }}
            />
            Woven Project
          </label>

          <label>
            <input
              type="radio"
              name="gmt"
              value="Knit"
              checked={gmt === "Knit"}
              onChange={(e) => setGmt(e.target.value)}
            />
            Knit Project
          </label>
        </div>

        <div className="input-grid">
          <div>
            <label htmlFor="qty">
              <i class="fas fa-shirt"></i> Order Quantity:
            </label>
            <input
              type="number"
              id="qty"
              placeholder="Write Quantities..."
              value={qty}
              step="1"
              min="1"
              onChange={(e) => {
                setQty(Number(e.target.value));
              }}
            />
          </div>

          <div>
            <label htmlFor="lead">
              <i class="fas fa-calendar"></i> Lead Time:
            </label>
            <select
              value={lead}
              onChange={(e) =>
                setLead(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="0">Select Lead Time</option>
              <option value="12">30 Days</option>
              <option value="18">60 Days</option>
              <option value="24">90 Days</option>
              <option value="30">120 Days</option>
            </select>
          </div>

          <div>
            <label htmlFor="smv">
              <i class="fas fa-stopwatch"></i> SMV:
            </label>
            <input
              type="number"
              id="smv"
              placeholder="What is SMV?"
              value={smv}
              step="0.01"
              min="0.01"
              onChange={(e) => {
                setSmv(Number(e.target.value));
              }}
            />
          </div>
          <div>
            <label htmlFor="mp">
              <i className="fas fa-users"></i> Manpower:
            </label>
            <input
              type="number"
              id="mp"
              placeholder="Required Manpower..."
              value={gmt === "Woven" ? 55 : mp}
              step="1"
              min="1"
              onChange={(e) => {
                setMp(Number(e.target.value));
              }}
            />
          </div>

        </div>
        <button onClick={calEff}>
          {" "}
          <i className="fas fa-calculator"></i> Calculate
        </button>
        <div
          className={`result ${result ? "glow" : ""}`}
          style={{
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <p>{result}</p>
        </div>
      </div>
    </>
  );
}

export default App;
