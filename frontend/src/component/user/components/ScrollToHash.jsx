import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Scroll to top on page change if no hash
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        // Handle scrolling to hash
        const id = hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
            // Give a tiny delay to ensure everything is rendered
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [pathname, hash]);

    return null; // This component doesn't render anything UI-wise
};

export default ScrollToHash;
