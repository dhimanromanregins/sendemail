import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Emails() {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/api/emails/')
      .then(response => {
        console.log('Success:', response.data);
        const extractedEmails = response.data.map(item => item.emails);
        setEmails(extractedEmails);
      })
      .catch(error => {
        console.error('Error:', error);
        setToastMessage('Error occurred while fetching emails. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/group-emails/')
      .then(response => {
        console.log('Group Options:', response.data);
        setGroupOptions(response.data.map(item => item.group_name));
      })
      .catch(error => {
        console.error('Error fetching group options:', error);
      });
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    const emailsToAdd = emailInput.split(',').map(email => email.trim());
    const data = { emails: emailsToAdd };

    axios.post('http://127.0.0.1:8000/api/emails/', data)
      .then(response => {
        console.log('Success:', response.data);
        toast.success('Emails added successfully!');
        setEmails(emails.concat(emailsToAdd));
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Error occurred. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
        setEmailInput('');
      });
  };

  const handleDelete = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const handleEmailSelect = (email) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(selectedEmail => selectedEmail !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleMouseDrag = (email) => {
    handleEmailSelect(email);
  };

  const handleMouseUp = () => {
    // Do something after mouse drag ends, if needed
  };

  const handleGroupSelect = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleAddToGroup = () => {
    if (selectedGroup === '') {
      toast.error('Please select a group.');
      return;
    }

    const data = {
      id: selectedGroup,
      email: emails,
    };

    axios.post('http://127.0.0.1:8000/api/emailgroup/', data)
      .then(response => {
        console.log('Success:', response.data);
        toast.success('Emails added to group successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Error occurred while adding emails to group. Please try again later.');
      });
  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', padding: '20px', width: '600px' }}>
          <h2>Add Emails</h2>
          <textarea
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            style={{ width: '100%', height: '150px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', resize: 'none' }}
            placeholder="Enter emails separated by commas"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Adding Email...' : 'Add'}
          </button>
          {toastMessage && <div style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{toastMessage}</div>}
          {emails.length > 0 && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Email</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <tr key={index}>
                      <td
                        style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: selectedEmails.includes(email) ? '#f0f0f0' : 'transparent' }}
                        onMouseDown={() => handleEmailSelect(email)}
                        onMouseEnter={() => handleMouseDrag(email)}
                        onMouseUp={() => handleMouseUp()}
                      >
                        {email}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <button onClick={() => handleDelete(index)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedEmails.length > 1 && (
                <div style={{ marginTop: '20px' }}>
                  <label htmlFor="groupSelect">Select Group:</label>
                  <select id="groupSelect" value={selectedGroup} onChange={handleGroupSelect}>
                    <option value="">Select a group</option>
                    {groupOptions.map((group, index) => (
                      <option key={index} value={group}>{group}</option>
                    ))}
                  </select>
                  <button onClick={handleAddToGroup} style={{ marginLeft: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }}>Add to Group</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
