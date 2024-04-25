import { useState } from 'react';
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(false);

  const sendData = async(e)=>{
    try{
      let emails = document.getElementById('emails').value;
      if (!emails) return;
      emails = emails.split(",");
      if (typeof(emails) != 'object') return;

      setLoading(true);

      e.target.textContent = 'Sending...';
      let api = 'http://52.151.192.152/api/send-email/';
      let response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({emails: emails}),
      });
      let result = await response.json();
      if (result.email_sent){
        e.target.textContent = 'Send';
        toast.success('Email sent successfully.', {autoClose: 1000});
      }
      else{
        e.target.textContent = 'Send';
      }
      setLoading(false);
    }
    catch(error){
      e.target.textContent = 'Send';
      setLoading(false);
      toast.error('Email send failed!', {autoClose: 1000});
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="data-forms">
        <div className="heading">Invoice Sender</div>
        <div className="forms">
          <div className="form">                 
            <textarea id='emails' type="text" placeholder="Emails" />
          </div>
        </div>
        <div className="options">
          <button className="send" disabled={loading} onClick={sendData}>Send</button>
        </div>
      </div>
    </>
  )
}

export default App;