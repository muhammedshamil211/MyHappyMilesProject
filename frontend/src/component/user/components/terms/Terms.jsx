import React, { useState } from 'react';
import styles from './Terms.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const TermsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
        <h2 className={styles.title}>Terms & Conditions</h2>

        <div
          className={styles.contentWrapper}
          style={{ maxHeight: isExpanded ? '1000px' : '150px' }}
        >
          <div className={styles.text}>
            <p>Welcome to our travel platform. By accessing our services, booking tour packages, or interacting with our website, you agree to be bound by the following professional guidelines and legal requirements.</p>

            <p><strong>1. Booking and Financial Obligations:</strong> All tour packages are subject to availability. A booking is only considered "Confirmed" once the initial deposit has been successfully processed and you have received an automated confirmation email. Prices are subject to change based on seasonal demand and local currency fluctuations until the full payment is received.</p>

            <p><strong>2. Cancellation and Refund Policy:</strong> We understand that plans change. However, our local partners require notice. Cancellations made 30 days prior to departure are eligible for an 80% refund. Cancellations made within 7 days of departure are strictly non-refundable due to pre-paid hotel and transport commitments.</p>

            <p><strong>3. Travel Insurance and Health:</strong> It is a mandatory requirement that all travelers possess valid comprehensive travel insurance covering medical expenses, personal accidents, and trip cancellations. The company is not liable for any injury, illness, or loss of personal property during the tour.</p>

            <p><strong>4. Itinerary Modifications:</strong> While we strive to follow the scheduled itinerary, we reserve the right to make changes due to weather conditions, strikes, road closures, or other "Force Majeure" events. Our priority is always the safety and comfort of our guests.</p>

            <p><strong>5. Documentation and Visas:</strong> Travelers are solely responsible for ensuring they hold valid passports (with at least 6 months validity) and the necessary visas for their chosen destinations. Entry requirements change frequently, and we recommend checking with the relevant embassies before booking.</p>

            <p><strong>6. Behavior and Conduct:</strong> We maintain a zero-tolerance policy for illegal activities or behavior that endangers other travelers or local communities. We reserve the right to terminate the tour for any individual whose conduct is deemed incompatible with the group's safety.</p>

            <p><strong>7. Intellectual Property:</strong> All images, text, and logos displayed on this platform are the property of the company. Unauthorized use or reproduction for commercial purposes is strictly prohibited.</p>
          </div>

          {!isExpanded && <div className={styles.gradientOverlay}></div>}
        </div>

        <button
          className={styles.readMoreBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>Show Less <FaChevronUp /></>
          ) : (
            <>Read More <FaChevronDown /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default TermsSection;