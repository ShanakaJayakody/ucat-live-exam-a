// ===========================
// Project Scaffolding (CLI – run once in your shell)
// ---------------------------
// npx create-vite@latest my-exam-app --template react-ts
// cd my-exam-app
// npm install
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// npm install react-router-dom@6
// ---------------------------


// ===========================
// Tailwind - enable the JIT engine
// File: tailwind.config.cjs
// ---------------------------
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

// ===========================
// Global Styles
// File: src/index.css
// ---------------------------
@tailwind base;
@tailwind components;
@tailwind utilities;


// ===========================
// Entry point
// File: src/main.tsx
// ---------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


// ===========================
// Central Router
// File: src/App.tsx
// ---------------------------
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExamEngine from './components/ExamEngine';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/exam/*" element={<ExamEngine />} />
    <Route path="/admin/*" element={<AdminDashboard />} />
  </Routes>
);

export default App;


// ===========================
// Placeholder Components
// (each in src/components/)
// ---------------------------

// File: src/components/ExamEngine.tsx
import React from 'react';
import SectionView from './SectionView';
import Timer from './Timer';

const ExamEngine: React.FC = () => (
  <main className="flex flex-col items-center min-h-screen bg-gray-100 p-8 space-y-6">
    <h1 className="text-3xl font-bold">Exam Engine</h1>
    <Timer />
    <SectionView />
  </main>
);

export default ExamEngine;


// File: src/components/SectionView.tsx
import React from 'react';
import QuestionDisplay from './QuestionDisplay';

const SectionView: React.FC = () => (
  <section className="w-full max-w-3xl bg-white p-6 rounded shadow">
    <h2 className="text-2xl font-semibold mb-4">Section View</h2>
    <QuestionDisplay />
  </section>
);

export default SectionView;


// File: src/components/QuestionDisplay.tsx
import React from 'react';

const QuestionDisplay: React.FC = () => (
  <div className="border border-gray-200 rounded p-4">
    <p className="text-gray-700">Question placeholder content…</p>
  </div>
);

export default QuestionDisplay;


// File: src/components/Timer.tsx
import React from 'react';

const Timer: React.FC = () => (
  <div className="text-xl font-mono">00:00</div>
);

export default Timer;


// File: src/components/AdminDashboard.tsx
import React from 'react';

const AdminDashboard: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
    <p className="text-gray-600">Placeholder for future admin features.</p>
  </div>
);

export default AdminDashboard;


// File: src/components/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Placeholder authentication logic
    navigate('/exam');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleLogin}
      >
        Sign In
      </button>
    </div>
  );
};

export default Login;

// End of scaffold
