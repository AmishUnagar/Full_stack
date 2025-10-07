import React from 'react'
import bnr from '../assets/img/About/bnr.webp'

const About = () => {
  return (
    <div>
      <section className='banner-about'>
      <img src={bnr} width="100%" height="300px" alt="" />
      <h2>ABOUT BRILLIORA</h2>
      </section>

      <section className="section-about">
        <div className="left">
          <h2>
            Jewelry and Diamonds deserve special attention. So does your
            business.
          </h2>
          <p>
            Selling a diamond ring isn’t like selling electronics or apparel.
            Valigara is the only multi-channel tool, specifically adjusted to
            jewellers’ needs. Our team is made up of jewelry and diamond experts
            with years of experience, that have identified unique features for
            every step of the eCommerce operation, relevant to selling jewelry
            and gemstones online. We have made it our mission to provide clients
            with effective solutions and create strong technological advantages
            over competitors in the jewelry industry.
          </p>
        </div>
        <div className="right">
          <img
            src="https://www.valigara.com/wp-content/webp-express/webp-images/uploads/2021/02/Device-Macbook-Air-2.png.webp"
            alt="Jewelry Business"
          />
        </div>
      </section>

      <section
        className="section-about"
        style={{ backgroundColor: "rgb(236, 236, 236)" }}
      >
        <div className="right">
          <img
            width="100%"
            src="https://www.valigara.com/wp-content/webp-express/webp-images/uploads/2021/12/gallery.png.webp"
            alt="Our Vision"
          />
        </div>
        <div className="left">
          <h2>Our Vision</h2>
          <ol>
            <li>Empower Jewelry and Diamonds Businesses in the eCommerce Era</li>
            <li>Make selling jewelry online easy</li>
            <li>Take Jewelry eCommerce to New Heights</li>
            <li>Power ecommerce for the world’s leading jewelers</li>
            <li>Push jewelry ecommerce forward</li>
            <li>Empower Jewelers Online</li>
            <li>Digitize Jewelry Commerce</li>
            <li>Grow Jewelry Commerce Everywhere</li>
            <li>Touch every jewelry transaction</li>
          </ol>
        </div>
      </section>

      <section className="section-about">
        <div className="left">
          <h2>
            Meet Igor Nusinovich, Valigara’s CEO and a global jewelry eCommerce
            expert
          </h2>
          <p>
            Igor is a global Jewelry eCommerce expert, visionary, and leader with
            decades of experience in online store management, product management,
            and software development.
          </p>
          <p>
            “I believe we are on a never-ending journey of discovery and learning.
            We seek feedback and insight to grow. At Valigara, we aim high, we
            stand by our word, we strive to do good, and empower our customers,
            employees, and business partners to succeed.”
          </p>
          <p>Igor is a Yogi and a father.</p>
        </div>
        <div className="right">
          <img
            width="100%"
            src="https://www.valigara.com/wp-content/webp-express/webp-images/uploads/2021/12/%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%9C%D7%9C%D7%90-%D7%A9%D7%9D-min.png.webp"
            alt="CEO"
          />
        </div>
      </section>

       
    </div>
  )
}

export default About