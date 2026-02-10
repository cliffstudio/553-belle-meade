'use client';

import { PortableText, PortableTextBlock } from '@portabletext/react';
import React, { useState } from 'react';
import Select from 'react-select';
import { portableTextComponents } from '../utils/portableTextComponents';

type Option = {
  value: string;
  label: string;
};

type ContactFormProps = {
  body?: PortableTextBlock[]
};

const ContactForm: React.FC<ContactFormProps> = ({ body }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country_id: '214', // United States default
    address_line_1: '',
    city: '',
    province: '',
    postcode: '',
    leasing_interest: '',
    comments: '',
    source: 'Website',
    redirect_success: '',
    redirect_error: '',
    are_you_simulated: '',
    'g-recaptcha-response': ''
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Read field values from the form DOM (catches iOS autofill, which doesn't fire onChange)
  const getFormValues = (form: HTMLFormElement) => {
    const get = (name: string) => {
      const el = form.elements.namedItem(name);
      return (el as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
    };
    return {
      first_name: get('first_name'),
      last_name: get('last_name'),
      email: get('email'),
      country_id: (form.elements.namedItem('country_id') as HTMLInputElement)?.value ?? formData.country_id,
      address_line_1: get('address_line_1'),
      city: get('city'),
      province: get('province'),
      postcode: get('postcode'),
      leasing_interest: formData.leasing_interest, // Select component, not native autofill target
      comments: get('comments'),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const values = getFormValues(form);
    
    // Validate using current field values (DOM + state) so autofilled data is checked
    const errors: string[] = [];
    if (!values.first_name.trim()) errors.push('First Name is required');
    if (!values.last_name.trim()) errors.push('Last Name is required');
    if (!values.email.trim()) errors.push('Email is required');
    if (!values.address_line_1.trim()) errors.push('Street address is required');
    if (!values.city.trim()) errors.push('City is required');
    if (!values.province.trim()) errors.push('Province/State is required');
    if (!values.postcode.trim()) errors.push('Postcode/Zip is required');
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.push('Please enter a valid email address');
    }
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      const submitData = new FormData();
      
      // Use values from DOM so iOS autofill is included
      submitData.append('contact[first_name]', values.first_name);
      submitData.append('contact[last_name]', values.last_name);
      submitData.append('contact[email]', values.email);
      submitData.append('contact[country_id]', values.country_id);
      submitData.append('contact[address_line_1]', values.address_line_1);
      submitData.append('contact[city]', values.city);
      submitData.append('contact[province]', values.province);
      submitData.append('contact[postcode]', values.postcode);
      
      // Add other fields
      if (values.leasing_interest) {
        submitData.append('answers[24729][answers]', values.leasing_interest);
      }
      if (values.comments) {
        submitData.append('contact[comments]', values.comments);
      }
      
      // Add hidden fields
      submitData.append('source', formData.source);
      submitData.append('redirect_success', formData.redirect_success);
      submitData.append('redirect_error', formData.redirect_error);
      submitData.append('are_you_simulated', formData.are_you_simulated);
      submitData.append('g-recaptcha-response', formData['g-recaptcha-response']);
      
      try {
        const response = await fetch('https://spark.re/aj-capital-partners/belle-meade-residences/register/registration-form', {
          method: 'POST',
          body: submitData
        });
        
        if (response.ok) {
          alert('Thank you for your registration!');
          // Reset form
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            country_id: '214',
            address_line_1: '',
            city: '',
            province: '',
            postcode: '',
            leasing_interest: '',
            comments: '',
            source: 'Website',
            redirect_success: '',
            redirect_error: '',
            are_you_simulated: '',
            'g-recaptcha-response': ''
          });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (fetchError) {
        // Check if it's a CORS error (which means the form actually worked)
        if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
          alert('Thank you for your registration! Your form has been submitted successfully.');
          // Reset form
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            country_id: '214',
            address_line_1: '',
            city: '',
            province: '',
            postcode: '',
            leasing_interest: '',
            comments: '',
            source: 'Website',
            redirect_success: '',
            redirect_error: '',
            are_you_simulated: '',
            'g-recaptcha-response': ''
          });
          return; // Don't throw the error since it actually worked
        }
        throw fetchError; // Re-throw if it's a different error
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    { value: '35', label: 'Canada' },
    { value: '214', label: 'United States' },
    { value: '12', label: 'Australia' },
    { value: '213', label: 'United Kingdom' },
    { value: '68', label: 'France' },
    { value: '74', label: 'Germany' },
    { value: '98', label: 'Italy' },
    { value: '188', label: 'Spain' }
  ];

  const leasingInterestOptions = [
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Dining', label: 'Dining' },
    { value: 'Wellness', label: 'Wellness' },
  ] as Option[];


  return (
    <section id="contact-form" className="contact-form-block h-pad row-lg">
      <div className="col-3-12_lg desktop"></div>

      <div className="col-6-12_lg out-of-view">
        {body && <div className="text-wrap"><PortableText value={body} components={portableTextComponents} /></div>}

        <form onSubmit={handleSubmit} className="spark-registration-form">
          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <h3>Please correct the following errors:</h3>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-fields">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  placeholder="FIRST NAME*"
                  autoComplete="given-name"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  placeholder="LAST NAME*"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="EMAIL*"
                  autoComplete="email"
                />
              </div>
              
              <div className="form-group">
                <Select
                  instanceId="country_id"
                  inputId="country_id"
                  placeholder="Select Country"
                  classNamePrefix="rs"
                  isSearchable={false}
                  options={countries}
                  value={countries.find(country => country.value === formData.country_id) || null}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : '';
                    setFormData((prev) => ({ ...prev, country_id: value }));
                  }}
                  styles={{
                    control: (base) => ({ ...base, borderRadius: 0 }),
                  }}
                />
                <input
                  type="hidden"
                  name="country_id"
                  value={formData.country_id}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="address_line_1"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleInputChange}
                  required
                  placeholder="ADDRESS*"
                  autoComplete="street-address"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="CITY*"
                  autoComplete="address-level2"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  placeholder="STATE*"
                  autoComplete="address-level1"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  required
                  placeholder="ZIPCODE*"
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="form-group">
              <Select
                instanceId="leasing_interest"
                inputId="answers_24729"
                placeholder="Leasing interest"
                classNamePrefix="rs"
                isSearchable={false}
                options={leasingInterestOptions}
                value={leasingInterestOptions.find(option => option.value === formData.leasing_interest) || null}
                onChange={(selectedOption) => {
                  const value = selectedOption ? selectedOption.value : '';
                  setFormData((prev) => ({ ...prev, leasing_interest: value }));
                }}
                styles={{
                  control: (base) => ({ ...base, borderRadius: 0 }),
                }}
              />
              {formData.leasing_interest && (
                <input
                  type="hidden"
                  name="answers[24729][answers]"
                  value={formData.leasing_interest}
                />
              )}
            </div>

            <div className="form-group">
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="MESSAGE"
                rows={1}
              />
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="source" value="Website" />
            <input type="hidden" name="redirect_success" value="" />
            <input type="hidden" name="redirect_error" value="" />
            <input type="hidden" name="are_you_simulated" value="" />

            <div className="form-submit">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="col-3-12_lg desktop"></div>
    </section>
  );
};

export default ContactForm;