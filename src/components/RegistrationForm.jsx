import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call to check for duplicate email
    // In a real app, you would call your backend API here
    const duplicateEmails = ['existing@example.com']; // Mock existing emails
    if (duplicateEmails.includes(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'An account with this email already exists'
      }));
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to create user
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Assume success
      setSubmitStatus('success');
      // Optionally reset form after success
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setSubmitStatus('error');
      // In a real app, you might set an error message from the response
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>Register</h2>
      {submitStatus === 'success' && (
        <div className="success-message">
          Registration successful! You can now log in.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="error-message">
          Registration failed. Please try again.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
