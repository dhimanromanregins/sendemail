import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../groupemail.css"
import Navbar from './Navbar';


export default function SendGroupEmail() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupOptions, setGroupOptions] = useState([]);
    const [isSending, setIsSending] = useState(false);
  
    useEffect(() => {
      // Fetch group options from API
      axios.get('http://52.151.192.152/api/send-group-email/')
        .then(response => {
          setGroupOptions(response.data.map(group => group.group_name));
        })
        .catch(error => {
          console.error('Error fetching group options:', error);
        });
    }, []);
  
    const handleSendGroupEmail = () => {
      if (!selectedGroup) {
        toast.error('Please select a group.');
        return;
      }
  
      setIsSending(true);
      axios.post('http://52.151.192.152/api/send-group-email/', { group_name: selectedGroup })
        .then(response => {
          toast.success('Group emails sent successfully!');
        })
        .catch(error => {
          toast.error('Error sending group emails.');
        })
        .finally(() => {
          setIsSending(false);
        });
    };
  
    const handleSelectChange = (e) => {
      setSelectedGroup(e.target.value);
    };
  
    return (
      <>
        <Navbar />
        <ToastContainer />
        <div className="send-bulk-email-container">
          <div className="warning-text">
            Warning: This will send the email to all the emails in the selected group.
          </div>
          <div className="select-container">
            <select
              value={selectedGroup}
              onChange={handleSelectChange}
            >
              <option value="">Select Group</option>
              {groupOptions.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <button
            className={`send-button ${selectedGroup ? '' : 'disabled'}`}
            disabled={!selectedGroup || isSending}
            onClick={handleSendGroupEmail}
          >
            {isSending ? 'Sending...' : 'Send Group Emails'}
          </button>
        </div>
      </>
    );
  }
