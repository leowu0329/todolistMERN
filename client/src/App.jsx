import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
