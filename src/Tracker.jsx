import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
// Bar Chart Component
const BarData = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" 
      fill="#8884d8"
      isAnimationActive={true}
      animationDuration={1000}
      animationEasing="ease-in-out" />
    </BarChart>
  </ResponsiveContainer>
);

const Tracker = () => {
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem("entries")) || []);
  const [item, setItem] = useState({ name: "", amount: "", type: "sale" });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const handleClearEntries = () => {
    setEntries([]);
    localStorage.removeItem("entries");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!item.name || !item.amount) return;
    const updated = [...entries, { ...item, amount: parseFloat(item.amount) }];
    setEntries(updated);
    setItem({ name: "", amount: "", type: "sale" });
  };

  const calculate = () => {
    let sales = 0,
      expenses = 0;
    entries.forEach((e) => (e.type === "sale" ? (sales += e.amount) : (expenses += e.amount)));
    return { sales, expenses, profit: sales - expenses };
  };

  const generateAIAdvice = async () => {
    setLoading(true);
    setSummary("");
    try {
      const response = await fetch("\.netlify\functions\openai", {
        method: "POST",
        headers: {  
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `You're a business analyst helping small business owners. Analyze the following sales and expense records and generate:
              1. A brief summary of today's financial activity.
              2. Key observations (e.g. most frequent expenses or top-selling items).
              3. Total sales, expenses, and profit.
              4. Advice or recommendations to improve future performance.
              Here is the data: ${JSON.stringify(entries)}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      const summaryText = data.choices?.[0]?.message?.content;
      setSummary(summaryText);

      // Parse numbers for chart
      const extractedNumbers = summaryText.match(/\d+(\.\d+)?/g);
      const [sales, expenses, profit] = extractedNumbers ? extractedNumbers.map((num) => parseFloat(num)) : [0, 0, 0];

      setChartData([
        { name: "Sales", value: sales },
        { name: "Expenses", value: expenses },
        { name: "Profit", value: profit },
      ]);
    } catch (error) {
      console.error("AI summary error:", error);
      setSummary("⚠️ Something went wrong while generating the AI summary.");
    } finally {
      setLoading(false);
    }
  };

  const { sales, expenses, profit } = calculate();

  const Receipt = React.forwardRef(({ entries }, ref) => (
    <div ref={ref} className="receipt">
      <h2>Receipt</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            {entry.type.toUpperCase()}: {entry.name} - ₦{entry.amount}
          </li>
        ))}
      </ul>
    </div>
  ));

  const receiptRef = useRef();

  const printReceipt = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handlePrint = () => {
    if (!receiptRef.current) {
      alert("Receipt not ready to print.");
      return;
    }
    printReceipt();
  };

  const handleForecast = async () => {
    if (entries.length === 0) {
      alert("No data to analyze for forecast");
      return;
    }

    const SalesData = entries
      .filter((entry) => entry.type === "sale")
      .map((entry) => `Date: ${entry.date || "N/A"}, Amount: ${entry.amount}`);

    const prompt = `
      Based on the following sales records, predict how the business might perform in the next 2 months.
      Sales Data: ${SalesData.join("\n")}

      Be concise, give the forecast in simple terms, and mention any clear trends.`;

    try {
      const response = await fetch("\.netlify\functions\openai", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const forecast = data.choices?.[0]?.message?.content;
      if (forecast) {
        setForecastResult(forecast);
      } else {
        throw new Error("Invalid forecast response");
      }
    } catch (error) {
      console.error("Forecast error:", error);
      alert("Error generating forecast.");
    }
  };

  return (
    <div className="page">
      <h2>My Business Tracker</h2>

      <form onSubmit={handleAdd} className="form">
        <input
          type="text"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          placeholder="Item name"
          required
        />
        <input
          type="number"
          value={item.amount}
          onChange={(e) => setItem({ ...item, amount: e.target.value })}
          placeholder="Amount"
          required
        />
        <select value={item.type} onChange={(e) => setItem({ ...item, type: e.target.value })}>
          <option value="sale">Sale</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="summary">
        <p>Total Sales: ₦{sales.toFixed(2)}</p>
        <p>Total Expenses: ₦{expenses.toFixed(2)}</p>
        <p><strong>Profit: ₦{profit.toFixed(2)}</strong></p>
      </div>

      <button onClick={generateAIAdvice} disabled={loading}>
        {loading ? "Generating..." : "Get AI Advice"}
      </button>

      {summary && (
        <motion.div className="ai-summary"
        intial={{ x: "100%", opacity: 0}}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h4>AI Summary</h4>
          <p>{summary}</p>
          {chartData.length > 0 && <BarData data={chartData} />}
        </motion.div>
      )}

      <button onClick={handleClearEntries} className="clear-button">Clear All Entries</button>
      <Receipt ref={receiptRef} entries={entries} />
      <button onClick={handlePrint} className="print-button">Print Receipt</button>
      <button onClick={handleForecast} className="forecast-button">Predict Sales</button>

      {forecastResult && (
        <div className="forecast-result">
          <h3>Forecast Result:</h3>
          <p>{forecastResult}</p>
        </div>
      )}
    </div>
  );
};

export default Tracker;
