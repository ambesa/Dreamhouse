

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.scss";

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    profileImage: null,
  });

  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "profileImage" ? files[0] : value,
    }));
  };

  const [passwordMatch, setPasswordMatch] = useState(true);
   const [errorMessage,seterrorMessage]=useState('');
  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmpassword || formData.confirmpassword === '');
  }, [formData.password, formData.confirmpassword]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      console.log('Passwords do not match.');
      return;
    }

    try {
      const registerForm = new FormData();
      for (const key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        body: registerForm
      });
      

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        if(errorData.message === 'User already exists!'){
          seterrorMessage("user alreadly exists")
        }
        else {
          seterrorMessage('Registration failed: ' + errorData.message);
        }
        console.log('Registration failed:', errorData.message);
      }
    } catch (error) {
      console.log('Registration failed:', error.message);
    }
  };

  return (
    <div className='register'>
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          <input
            placeholder='First Name'
            required
            name='firstname'
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            placeholder='Last Name'
            required
            name='lastname'
            value={formData.lastname}
            onChange={handleChange}
          />
          <input
            placeholder='Email'
            required
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          <input
            placeholder='Password'
            required
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
          <input
            placeholder='Confirm Password'
            required
            type='password'
            name='confirmpassword'
            value={formData.confirmpassword}
            onChange={handleChange}
          />
          {!passwordMatch && (<p style={{ color: "red" }}>Passwords do not match</p>)}
          {errorMessage && (<p style={{ color: "red" }}>{errorMessage}</p>)}
          <input
            name='profileImage'
            type='file'
            accept='image/*'
            onChange={handleChange}
          />
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile"
              style={{ maxWidth: "80px" }}
            />
          )}
          <a href='/login'>Already Have An Account? Login Here</a>
          <button disabled={!passwordMatch}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;