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

    const cat = (smv) => {
      if (smv <= 4.5) return "b_1";
      if (smv <= 7.5) return "b_2";
      if (smv <= 11.5) return "s_1";
      if (smv <= 15) return "s_2";
      if (smv <= 18.5) return "c_1";
      if (smv <= 22) return "c_2";
      if (smv <= 25) return "h_1";
      return "h_2";
    };

    const lCurve = {
      b_1: [
        0.4, 0.5, 0.6, 0.7, 0.75, 0.75, 0.75, 0.8, 0.8, 0.85, 0.85, 0.85, 0.85,
        0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
      ],
      b_2: [
        0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.75, 0.75, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
        0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8,
      ],
      s_1: [
        0.25, 0.35, 0.45, 0.55, 0.6, 0.65, 0.65, 0.7, 0.7, 0.75, 0.75, 0.75,
        0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75,
      ],
      s_2: [
        0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.6, 0.6, 0.65, 0.7, 0.7, 0.7, 0.7, 0.7,
        0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
      ],
      c_1: [
        0.15, 0.25, 0.35, 0.45, 0.55, 0.55, 0.6, 0.6, 0.6, 0.65, 0.65, 0.65,
        0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65,
      ],
      c_2: [
        0.15, 0.25, 0.35, 0.45, 0.55, 0.55, 0.55, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6,
        0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6,
      ],
      h_1: [
        0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.55, 0.55, 0.6, 0.6, 0.6, 0.6, 0.6,
        0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6,
      ],
      h_2: [
        0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5, 0.55, 0.55, 0.55, 0.55, 0.55,
        0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55,
      ],
    };

    const hTarget = Math.round((600 * mp) / smv);
    const curve = lCurve[cat(smv)];

    let total = 0;
    let days = 0;

    while (total < qty) {
      const index = days % Math.min(lead, curve.length - 1);
      const daily = Math.round(curve[index] * hTarget);

      total += daily;
      days++;
    }

    const earnMinutes = qty * smv * 100;
    const lines = Math.ceil(Number(days / lead));
    const qco = (gmt === "Woven" ? 65 : mp) * 5 * lines;
    const availableMinutes = (gmt === "Woven" ? 65 : mp) * 600 * days + qco;

    const eff = (earnMinutes / availableMinutes).toFixed(2);
    const cpm = (0.06 / (eff / 100)).toFixed(4);
    //const tgt = Math.round((hTarget * eff) / 1000);

    setResult(
      <>
        🎯 Efficiency: {eff}% <br />
        💰 CPM ≥ ${cpm}
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
            Pre-Costing Efficiency% Calculation | &#169; Nazmul N Hassan | Head
            of Industrial Engineering | 2024
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
                  setMp(65); // set default once
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
              <option value="6">30 Days</option>
              <option value="12">60 Days</option>
              <option value="18">90 Days</option>
              <option value="24">120 Days</option>
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
              value={gmt === "Woven" ? 65 : mp}
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
