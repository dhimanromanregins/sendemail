import { useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [forms, setForms] = useState([{
    id: 1,
    name: '',
    price: '',
    email: '',
    mobile_number: '',
  }]);
  const [loading, setLoading] = useState(false);

  const addForm = ()=>{
    const hasEmptyField = forms.some(form => {
      return (
        form.name.trim() === '' ||
        form.price.trim() === '' ||
        form.email.trim() === '' ||
        form.mobile_number.trim() === ''
      );
    });
  
    if (hasEmptyField) {
      toast.error('Please fill in all fields in existing forms!', {autoClose: 1500});
      return;
    };

    let newForm = {
      id: forms.length + 1,
      name: '',
      price: '',
      email: '',
      mobile_number: '',
    };
    setForms([...forms, newForm]);

    const addedElement = document.getElementsByClassName('added')[0];
    if (addedElement){
      addedElement.style.display = 'inline';
      let translateY = 2;
      const interval = setInterval(() => {
        translateY -= 1;
        addedElement.style.transform = `translate(5px, ${translateY}px)`;
        if (translateY <= -12) {
          clearInterval(interval);
          addedElement.style.display = 'none';
        }
      }, 30);
      addedElement.style.transform = 'translate(5px, 2px)';
    };
  };

  const deleteForm = (id)=>{
    if (forms.length === 1){
      return;
    }
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleValueChange = (index, event) => {
    const { name, value } = event.target;
    const newForms = [...forms];
    newForms[index][name] = value;
    setForms(newForms);
  };

  const sendData = async(e)=>{
    try{
      const hasEmptyField = forms.some(form => {
        return (
          form.name.trim() === '' ||
          form.price.trim() === '' ||
          form.email.trim() === '' ||
          form.mobile_number.trim() === ''
        );
      });

      if (hasEmptyField) {
        toast.error('Please fill in all fields in forms!', {autoClose: 1000});
        return;
      };

      setLoading(true);

      e.target.textContent = 'Sending...';
      let api = 'http://52.151.192.152/api/send-email/';
      let response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forms),
      });
      let result = await response.json();
      if (result.email_sent){
        e.target.textContent = 'Send';
        let newForm = {
          id: 1,
          name: '',
          price: '',
          email: '',
          mobile_number: '',
        };
        setForms([newForm]);
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
        <div className="heading">Data Sender</div>
        <div className="forms">
          {
            forms.map((form, index)=>{
              return(
                <div className="form" key={index}>
                  <input name="name" type="text" placeholder="Name" value={form.name} onChange={(e) => handleValueChange(index, e)} />
                  <input name="price" type="text" placeholder="Price" value={form.price} onChange={(e) => handleValueChange(index, e)} />
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => handleValueChange(index, e)} />
                  <input name="mobile_number" type="text" placeholder="Mob Number" value={form.mobile_number} onChange={(e) => handleValueChange(index, e)} />
                  <FontAwesomeIcon icon={faTimes} onClick={()=>deleteForm(form.id)} className="delete-form" />
                </div>
              )
            })
          }
        </div>
        <div className="options">
          <button className="send" disabled={loading} onClick={sendData}>Send</button>
          <div className="add-user-btn">
            <button className="add-user" disabled={loading} onClick={addForm}>Add user</button>
            <span className="added">+1</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;