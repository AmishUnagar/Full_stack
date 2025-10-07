import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    checkbox: true,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Add your form validation / API call here
    console.log("Form submitted:", formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      message: "",
      checkbox: true,
    });
  };

  return (
    <div>
    <div className="contain">
      <div className="wrapper">
        <div className="form">
          <h4>GET IN TOUCH</h4>
          <h2 className="form-headline">Send us a message</h2>

          <form id="submit-form" onSubmit={handleSubmit}>
            <p>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="Your Name*"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="Your Email*"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </p>

            <p className="full-width">
              <input
                id="company"
                className="form-input"
                type="text"
                placeholder="Company Name*"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </p>

            <p className="full-width">
              <textarea
                id="message"
                cols="30"
                rows="7"
                placeholder="Your Message*"
                value={formData.message}
                onChange={handleChange}
                required
                minLength={20}
              />
            </p>

            <p className="full-width">
              <input
                type="checkbox"
                id="checkbox"
                checked={formData.checkbox}
                onChange={handleChange}
              />{" "}
              Yes, I would like to receive communications by call / email about
              Company's services.
            </p>

            <p className="full-width">
              <input type="submit" className="submit-btn" value="Submit" />
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </p>
          </form>
        </div>

        <div className="contacts contact-wrapper">
          <ul>
            <li>
              We've driven online revenues of over{" "}
              <span className="highlight-text-grey">$2 billion</span> for our
              clients. Ready to know how we can help you?
            </li>
            <span className="hightlight-contact-info">
              <li className="email-info">
                <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                info@demo.com
              </li>
              <li>
                <i className="fa fa-phone" aria-hidden="true"></i>{" "}
                <span className="highlight-text">+91 11 1111 2900</span>
              </li>
            </span>
          </ul>
        </div>
      </div>
    </div>
    <div style={{ width: "100%", marginTop: "50px" }}>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319"
    width="100%"
    height="500"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


</div>
  );
}
