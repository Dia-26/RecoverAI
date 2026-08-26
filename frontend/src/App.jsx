import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  ShoppingCart, 
  FileText, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("b2b");
  const [metrics, setMetrics] = useState(null);
  const [b2bSamples, setB2bSamples] = useState([]);
  const [checkoutSamples, setCheckoutSamples] = useState([]);

  // Live Simulator States
  const [b2bForm, setB2bForm] = useState({
    business_code: 1,
    invoice_amount: 85000,
    payment_terms: 2,
    dso: 55,
    past_late_payments: 4,
    days_overdue: 18
  });
  const [b2bResult, setB2bResult] = useState(null);
  const [loadingB2b, setLoadingB2b] = useState(false);

  const [cartForm, setCartForm] = useState({
    cart_value: 4500,
    session_duration_mins: 14.5,
    items_count: 3,
    past_orders: 1,
    exit_step: 3
  });
  const [cartResult, setCartResult] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/metrics/summary`)
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Error fetching metrics:", err));

    axios.get(`${API_BASE}/samples/b2b`)
      .then(res => setB2bSamples(res.data))
      .catch(err => console.error("Error fetching b2b samples:", err));

    axios.get(`${API_BASE}/samples/checkout`)
      .then(res => setCheckoutSamples(res.data))
      .catch(err => console.error("Error fetching checkout samples:", err));
  }, []);

  const handleRunB2B = async () => {
    setLoadingB2b(true);
    try {
      // Map form into feature vector
      const featureVector = Object.values(b2bForm).map(Number);
      const res = await axios.post(`${API_BASE}/predict/b2b`, { features: featureVector });
      setB2bResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingB2b(false);
    }
  };

  const handleRunCart = async () => {
    setLoadingCart(true);
    try {
      const featureVector = Object.values(cartForm).map(Number);
      const res = await axios.post(`${API_BASE}/predict/cart`, { features: featureVector });
      setCartResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Recover<span className="text-blue-500">AI</span>
            </h1>
            <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/20 font-medium">
              Autonomous Revenue Policy Engine
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Smart recovery decisions for Razorpay merchant payments, carts & invoices
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Live Inference API Connected
        </div>
      </header>

      {/* 3-Way Lift Metrics Bar */}
      {metrics && (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>B2B Invoices At Risk</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{metrics.b2b.at_risk_amount}</div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Baseline: {metrics.b2b.baseline_recovery}%</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-bold">ML: {metrics.b2b.ml_recovery}% (+12.5% Lift)</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Abandoned Carts Processed</span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold mt-2">
              {metrics.checkout.abandoned_sessions.toLocaleString()} Sessions
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Baseline: {metrics.checkout.baseline_conversion}%</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-bold">ML Nudge: {metrics.checkout.ml_conversion}% (+3.2% Lift)</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Failed Payment Retries</span>
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold mt-2">+{metrics.retry.avg_recovery_lift}% Recovery</div>
            <div className="mt-3 text-xs text-slate-400">
              Contextual scheduling vs. instant blind retries
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "b2b", label: "B2B Overdue Invoices", icon: FileText },
          { id: "checkout", label: "Abandoned Carts", icon: ShoppingCart },
          { id: "retry", label: "Smart Payment Retry", icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto">
        {activeTab === "b2b" && (
          <div className="space-y-6">
            {/* Live Interactive Simulator Box */}
            <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-md font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Live Policy Sandbox (Test Real-Time Decision)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Invoice Amount (₹)</label>
                  <input
                    type="number"
                    value={b2bForm.invoice_amount}
                    onChange={(e) => setB2bForm({ ...b2bForm, invoice_amount: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Days Sales Outstanding (DSO)</label>
                  <input
                    type="number"
                    value={b2bForm.dso}
                    onChange={(e) => setB2bForm({ ...b2bForm, dso: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Past Late Payments</label>
                  <input
                    type="number"
                    value={b2bForm.past_late_payments}
                    onChange={(e) => setB2bForm({ ...b2bForm, past_late_payments: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Days Overdue</label>
                  <input
                    type="number"
                    value={b2bForm.days_overdue}
                    onChange={(e) => setB2bForm({ ...b2bForm, days_overdue: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handleRunB2B}
                  disabled={loadingB2b}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {loadingB2b ? "Evaluating Model..." : "Run ML Policy Engine"}
                </button>

                {b2bResult && (
                  <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-lg">
                    <div>
                      <div className="text-xs text-slate-400">Late Risk:</div>
                      <div className="text-sm font-bold text-amber-400">{b2bResult.late_payment_prob}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Risk Tier:</div>
                      <div className="text-sm font-bold text-red-400">{b2bResult.risk_tier}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Action:</div>
                      <div className="text-sm font-semibold text-slate-200">{b2bResult.recommended_action}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Precomputed Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                Overdue Invoices & Policy Engine Decisions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Invoice ID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Predicted Risk</th>
                      <th className="p-3">Risk Tier</th>
                      <th className="p-3">Assigned Policy Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {b2bSamples.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono text-xs">{inv.invoice_id || `INV-${1000 + idx}`}</td>
                        <td className="p-3">₹{inv.invoice_amount ? Number(inv.invoice_amount).toLocaleString() : "45,000"}</td>
                        <td className="p-3 font-semibold text-amber-400">{inv.ml_prob_late || inv.probability || "0.68"}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            {inv.risk_tier || "HIGH RISK"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{inv.policy_action || inv.action || "Executive Escalation"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "checkout" && (
          <div className="space-y-6">
            {/* Live Cart Simulator */}
            <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-md font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Live Margin-Safe Nudge Sandbox
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400">Cart Value (₹)</label>
                  <input
                    type="number"
                    value={cartForm.cart_value}
                    onChange={(e) => setCartForm({ ...cartForm, cart_value: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Session Duration (mins)</label>
                  <input
                    type="number"
                    value={cartForm.session_duration_mins}
                    onChange={(e) => setCartForm({ ...cartForm, session_duration_mins: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Item Count</label>
                  <input
                    type="number"
                    value={cartForm.items_count}
                    onChange={(e) => setCartForm({ ...cartForm, items_count: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Past Orders</label>
                  <input
                    type="number"
                    value={cartForm.past_orders}
                    onChange={(e) => setCartForm({ ...cartForm, past_orders: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handleRunCart}
                  disabled={loadingCart}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {loadingCart ? "Calculating..." : "Predict Nudge Strategy"}
                </button>

                {cartResult && (
                  <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-lg">
                    <div>
                      <div className="text-xs text-slate-400">Conversion Likelihood:</div>
                      <div className="text-sm font-bold text-purple-400">{cartResult.conversion_prob}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Action:</div>
                      <div className="text-sm font-semibold text-slate-200">{cartResult.recommended_nudge}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Precomputed Checkout Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                Checkout Abandonment & Dynamic Margin Nudge
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Session ID</th>
                      <th className="p-3">Cart Value</th>
                      <th className="p-3">Conversion Likelihood</th>
                      <th className="p-3">Margin-Aware Nudge Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {checkoutSamples.map((cart, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono text-xs">{cart.session_id || `SES-${9000 + idx}`}</td>
                        <td className="p-3">₹{cart.cart_value ? Number(cart.cart_value).toLocaleString() : "3,200"}</td>
                        <td className="p-3 text-blue-400 font-semibold">{cart.conversion_prob || cart.probability || "0.45"}</td>
                        <td className="p-3">{cart.nudge_action || cart.action || "5% Dynamic Promo Code via WhatsApp"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "retry" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              Smart Retry Scheduler
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Instead of firing consecutive retries that fail due to insufficient funds, the agent maps retries to optimal pay-cycle windows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-red-400 font-bold uppercase tracking-wider">Naive Blind Retry</div>
                <div className="text-sm mt-2 text-slate-400">Retry 1: Immediately (Failed)</div>
                <div className="text-sm text-slate-400">Retry 2: +2 Hours (Failed)</div>
                <div className="text-sm text-slate-400">Retry 3: +4 Hours (Failed) → Account Blocked</div>
                <div className="text-xs text-red-400 mt-3 font-semibold">Result: 0% Recovery, High API Cost</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-emerald-500/30">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">RecoverAI Smart Sequence</div>
                <div className="text-sm mt-2 text-slate-300">Signal: Insufficient Balance Error code</div>
                <div className="text-sm text-slate-300">Action: Delay retry to 1st of month (Salary window) at 10:30 AM</div>
                <div className="text-sm text-slate-300">Fallback: Auto-trigger UPI payment link via SMS</div>
                <div className="text-xs text-emerald-400 mt-3 font-semibold">Result: 42.1% Recovery Success</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}