# ⚡ KINETIC_ROOM — Trading Room UI & Futures Execution Tools

An AI-assisted web design and interactive UI prototype for an institutional-style futures trading room, combining real-time price telemetry with built-in contract risk and profit-target calculators.

---

## ✨ Key Features

### 1. Futures Target & Tick Calculator (`src/components/TargetCalculator.tsx`)
Interactive position-sizing and target-price calculator tailored for CME index futures:
- **Supported Contracts**:
  - **MNQ** (*Micro E-mini Nasdaq-100* — `$2.00/pt`, `$0.50/tick`)
  - **NQ** (*E-mini Nasdaq-100* — `$20.00/pt`, `$5.00/tick`)
  - **MES** (*Micro E-mini S&P 500* — `$5.00/pt`, `$1.25/tick`)
  - **ES** (*E-mini S&P 500* — `$50.00/pt`, `$12.50/tick`)
- **Real-Time Target Computation**: Calculates exact exit prices, required points, and tick distances for `BUY` (Long) and `SELL` (Short) positions given an entry price, contract lot size, and dollar profit target.

### 2. Live Streaming Market Telemetry (`src/App.tsx`)
- **Real-Time Tick Charting**: Powered by `Liveline` with momentum color transitions, interactive scrubbing, and automatic fallback simulation if external price APIs rate-limit.
- **Trading Room Interface**: High-contrast dark-mode kinetic UI with smooth layout transitions (`Motion`), live market news stream integration, and modular tool drawers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Animation & Charting**: Motion (`motion/react`), `liveline`, Lucide Icons
- **Build Tooling**: Vite 6

---

## 🚀 Getting Started

```bash
git clone https://github.com/dmrusoff/kinetic_room.git
cd kinetic_room
npm install
npm run dev
```
