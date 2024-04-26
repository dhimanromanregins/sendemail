import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import "../bulk.css"
import Navbar from './Navbar';

export default function SendBulkEmail() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSendBulkEmail = () => {
    setIsSending(true); // Set isSending to true before making the API call
    axios.post('http://52.151.192.152/api/send-bulk-email/')
      .then(response => {
        toast.success('Bulk emails sent successfully!');
      })
      .catch(error => {
        toast.error('Error sending bulk emails.');
      })
      .finally(() => {
        setIsSending(false); // Set isSending back to false after the API call completes
      });
  };

  return (
    <>
      <Navbar />
      {/* Add ToastContainer */}
      <ToastContainer />
      <div className="send-bulk-email-container">
        <div className="warning-text">
          Warning: This will send the email to all the emails in the Email List table.
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="bulk-email-checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="bulk-email-checkbox">I agree to send bulk email</label>
        </div>
        <button 
          className={`send-button ${isChecked ? '' : 'disabled'}`} 
          disabled={!isChecked || isSending}
          onClick={handleSendBulkEmail}
        >
          {isSending ? 'Sending...' : 'Send Bulk Email'}
        </button>
      </div>
    </>
  );
}
