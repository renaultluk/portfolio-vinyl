import { useRef, useEffect, useState } from "react";
import { useScroll, motion, useTransform } from "motion/react";

const ParallaxSection = ({ 
    children, 
    className = "", 
    stickyIndex = null, // [startIndex, endIndex] - range of page indices where this section sticks
    scrollContainer 
}) => {
    const sectionRef = useRef();
    const contentRef = useRef();
    
    // Check if this section should be sticky
    const isSticky = stickyIndex !== null && Array.isArray(stickyIndex) && stickyIndex.length === 2;
    const [startIndex, endIndex] = isSticky ? stickyIndex : [0, 0];
    const stickyDuration = isSticky ? (endIndex - startIndex + 1) : 1;
    
    const { scrollYProgress } = useScroll({ 
        target: sectionRef,
        container: scrollContainer,
        offset: ["start start", "end start"]
    });
    
    // Calculate opacity for sticky sections based on scroll progress
    const opacity = isSticky ? useTransform(
        scrollYProgress,
        [0, 0.8, 1],
        [1, 1, 0.3]
    ) : 1;
    
    // Calculate scale effect for depth
    const scale = isSticky ? useTransform(
        scrollYProgress,
        [0, 1],
        [1, 0.95]
    ) : 1;
    
    // For sticky sections, height = duration * viewport height
    const sectionHeight = isSticky ? `${stickyDuration * 100}vh` : '100vh';
    
    return (
        <section 
            ref={sectionRef} 
            className={`relative w-full ${className}`}
            style={{ height: sectionHeight }}
        >
            <motion.div 
                ref={contentRef}
                className={`flex h-screen w-full items-center justify-center ${isSticky ? 'sticky top-0' : ''}`}
                style={isSticky ? { opacity, scale } : {}}
            >
                {children}
            </motion.div>
        </section>
    )
}

export default ParallaxSection;