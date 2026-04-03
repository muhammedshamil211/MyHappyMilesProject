import React from 'react';
import logo1 from "../../../../assets/logo1.png";
import styles from './footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.footerMain}>
                {/* Column 1: Brand & About */}
                <div className={styles.brandCol}>
                    <img src={logo1} className={styles.logo} alt="MyHappyMiles" />
                    <p className={styles.aboutText}>
                        Your ultimate gateway to unforgettable journeys. We specialize in crafting seamless, 
                        luxury, and adventure-filled travel experiences worldwide.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="#facebook" className={styles.socialIcon} aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#twitter" className={styles.socialIcon} aria-label="Twitter"><FaTwitter /></a>
                        <a href="#instagram" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>
                        <a href="#linkedin" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedinIn /></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Discovery</h3>
                    <ul className={styles.linkList}>
                        <li><a href="/">Home</a></li>
                        <li><a href="/places">Destinations</a></li>
                        <li><a href="/packages">Tour Packages</a></li>
                        <li><a href="#gallery">Travel Gallery</a></li>
                        <li><a href="#offers">Special Offers</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Support</h3>
                    <ul className={styles.linkList}>
                        <li><a href="#faq">Help Center & FAQ</a></li>
                        <li><a href="#insurance">Travel Insurance</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#contact">Emergency Support</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact info */}
                <div className={styles.contactCol}>
                    <h3 className={styles.colTitle}>Connect With Us</h3>
                    <div className={styles.contactItem}>
                        <FaPhoneAlt className={styles.contactIcon} />
                        <div>
                            <p className={styles.contactLabel}>Call our experts</p>
                            <p className={styles.contactValue}>+91 98765 43210</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <FaEnvelope className={styles.contactIcon} />
                        <div>
                            <p className={styles.contactLabel}>Email inquiries</p>
                            <p className={styles.contactValue}>hello@myhappymiles.com</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <FaMapMarkerAlt className={styles.contactIcon} />
                        <div>
                            <p className={styles.contactLabel}>Our Headquarters</p>
                            <p className={styles.contactValue}>Mumbai, Maharashtra, India</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.footerBottom}>
                <p>© 2024 MyHappyMiles Travel. All rights reserved.</p>
                <div className={styles.bottomLinks}>
                    <a href="#terms">Terms</a>
                    <span className={styles.separator}>|</span>
                    <a href="#privacy">Privacy</a>
                    <span className={styles.separator}>|</span>
                    <a href="#cookies">Cookies</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;