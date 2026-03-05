import React from 'react';
import logo1 from "../../../../assets/logo1.png";
import styles from './footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <img src={logo1} className={styles.logo} alt="Company Logo" />
            
            <div className={styles.column}>
                <h2>Our Office</h2>
                <p className={styles.text}>
                    Located across the country, ready to assist in planning & booking your perfect vacation.
                </p>
            </div>

            <div className={styles.column}>
                <h2>Call Us</h2>
                <p className={styles.text}>
                    Request a quote, or just chat about your next vacation. We're always happy to help!
                </p>
            </div>

            <div className={styles.column}>
                <h2>Connect</h2>
                <p className={styles.text}>
                    Find exclusive offers, updates and more on our social platforms.
                </p>
            </div>

            <div className={styles.column}>
                <h2>About</h2>
                <p className={styles.text}>
                    Dedicated to providing seamless travel experiences and unforgettable memories since 2024.
                </p>
            </div>
        </footer>
    );
}

export default Footer;