import { useState, useEffect } from 'react';

const useSidebarBottombar = () => {
    const [screenSize, setScreenSize] = useState(() => {
        const width = window.innerWidth;
        if (width >= 1024) return 'desktop';
        if (width >= 540) return 'tablet';
        return 'mobile';
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) setScreenSize('desktop');
            else if (width >= 540) setScreenSize('tablet');
            else setScreenSize('mobile');
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};

export default useSidebarBottombar;
