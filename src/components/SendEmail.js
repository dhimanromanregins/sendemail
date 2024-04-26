import { useState } from 'react';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import axios from 'axios';

function SendEmail() {
  const [formData, setFormData] = useState({
    name: '',
    sender_name: '',
    price: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    sender_name: '',
    price: '',
    name: '',
    email: ''
  });
  const [sending, setSending] = useState(false); // State to track sending state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (value.trim() !== '') {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const sendData = () => {
    // Set sending state to true when starting to send
    setSending(true);

    const { sender_name, price, name } = formData;
    const anyNonEmailFilled = sender_name.trim() !== '' || price.trim() !== '' || name.trim() !== '';
  
    if (formData.email.trim() === '') {
      setErrors({ ...errors, email: 'Email is required' });
      // Reset sending state to false if there's an error
      setSending(false);
      return;
    }
  
    if (!anyNonEmailFilled) {
      let email_list = formData.email.split(",");
      const data = {
        email: email_list
      };
      const apiUrl = 'http://52.151.192.152/api/send-email/';
  
      axios.post(apiUrl, data)
        .then(response => {
          console.log('Data sent successfully:', response.data);
          // Show success toast notification
          toast.success('Email sent successfully');
          // Reset form data and errors after successful sending
          setFormData({
            name: '',
            sender_name: '',
            price: '',
            email: ''
          });
          setErrors({
            sender_name: '',
            price: '',
            name: '',
            email: ''
          });
        })
        .catch(error => {
          console.error('Error sending data:', error);
          // Show error toast notification
          toast.error('Error sending email');
        })
        .finally(() => {
          // Reset sending state to false after sending or error
          setSending(false);
        });
    } else {
      const requiredErrors = {};
      let hasError = false;
  
      for (const key in formData) {
        if (formData[key].trim() === '') {
          requiredErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          hasError = true;
        }
      }
  
      if (hasError) {
        setErrors({ ...errors, ...requiredErrors });
        // Reset sending state to false if there's an error
        setSending(false);
        return;
      }
  
      const data = {
        ...formData
      };
  
      const apiUrl = 'http://52.151.192.152/api/send-email/';
  
      axios.post(apiUrl, data)
        .then(response => {
          console.log('Data sent successfully:', response.data);
          // Show success toast notification
          toast.success('Email sent successfully');
          // Reset form data and errors after successful sending
          setFormData({
            name: '',
            sender_name: '',
            price: '',
            email: ''
          });
          setErrors({
            sender_name: '',
            price: '',
            name: '',
            email: ''
          });
        })
        .catch(error => {
          console.error('Error sending data:', error);
          // Show error toast notification
          toast.error('Error sending email');
        })
        .finally(() => {
          // Reset sending state to false after sending or error
          setSending(false);
        });
    }
  };

  return (
    <>
    <Navbar />
    <div className="data-forms">
      <div className="heading">Invoice Sender</div>
      <div className="forms">
        <div className="form">
          <input id='name' type="text" placeholder="Name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
          <input id='sender_name' type="text" placeholder="Sender Email" value={formData.sender_name} onChange={handleChange} />
          {errors.sender_name && <span className="error">{errors.sender_name}</span>}
          <input id='price' type="text" placeholder="Price" value={formData.price} onChange={handleChange} />
          {errors.price && <span className="error">{errors.price}</span>}
          <textarea id='email' placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
      </div>
      <div className="options">
        <button className="send" type='submit' onClick={sendData} disabled={sending}>
          {sending ? 'Sending' : 'Send'}
        </button>
      </div>
      <ToastContainer />
    </div>
    </>
  );
}

export default SendEmail;
