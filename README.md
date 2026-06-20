# C.A.R.E. (Carbon Action Rating & Eco-dashboard)

C.A.R.E. is a full-stack, responsive web application designed to help individuals track, understand, and reduce their carbon footprint through actionable insights and an AI-powered coaching system.

## 🌟 Key Features

### 📊 Dashboard Widgets
- **Carbon Snapshot**: Get a real-time, high-level overview of your carbon footprint with an at-a-glance performance rating and current usage metrics (kg CO₂).
- **Action Countdown**: Stay engaged with proactive, gamified steps to take action, including an interactive completion sequence.
- **Carbon Impact Twin**: A visualization comparing your current status to your future eco-friendly potential.

### 🤖 AI-Powered Eco Coach
Powered by the Gemini API via a secure backend server, the **Eco Coach** provides real-time, context-aware suggestions. Whether you ask about energy-saving tips or sustainable transport, the Coach adapts its responses based on the user's settings.

### ⚙️ Inclusive & Adaptive Settings
Users can customize their experience using the dedicated settings context, which adjusts both the UI and the AI responses:
- **Accessibility Mode**: Enhances contrast and formatting for easier readability.
- **Neurodivergent Mode**: Instructs the Eco Coach to use clear formatting, simple language, and minimal lists to avoid cognitive overload.
- **Simplified Mode**: Streamlines the UI to focus only on core actions.

### ☁️ Cloud Persistence (via Firebase)
Seamless anonymous authentication automatically signs users in, storing their context, preferences, and Eco Coach chat history smoothly via Firestore (with robust fallback mechanisms using local storage if Firestore is unconfigured).

## 🛠 Tech Stack
- **Frontend Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, utilizing `lucide-react` for iconography.
- **Backend**: Express.js server (serves the Gemini AI requests)
- **Database/Auth**: Firebase Auth (Anonymous) & Firestore
- **Testing**: Vitest and React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A Gemini API Key (`GEMINI_API_KEY`)

### Installation & Execution

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Ensure your `.env` contains the required keys (especially `GEMINI_API_KEY` for the AI functionality).

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   *Note: This utilizes `tsx` to run the backend server and compile the Vite frontend dynamically.*

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

The application includes robust tests encompassing widget rendering, context application, and mock-fetch tests for the AI chat flow.

To run the test suite:
```bash
npx vitest run
```
