import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SendEmail from './components/SendEmail';
import Navbar from './components/Navbar';
import SendBulkEmail from './components/SendBulkEmail';
import SendGroupEmail from './components/SendGroupEmail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SendEmail />} />
        <Route path="/bulk-email-sender" element={<SendBulkEmail />} />
        <Route path="/group-email" element={<SendGroupEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
