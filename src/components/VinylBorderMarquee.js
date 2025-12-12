import { useAnimationFrame, useScroll, useVelocity } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const cornerSmoothing = (p, edgeIndex, borderRadius) => {
    //TODO: edge smoothing animation
}

const getPositionOnRect = (progress, width, height) => {
  const perimeter = 2 * (width + height);
  const p = progress % perimeter;
  let x, y, rotation;
  
  if (p <= width) {
    x = p;
    y = 0;
    rotation = 0; // Top edge, facing right
  } else if (p <= width + height) {
    x = width;
    y = p - width;
    rotation = 90; // Right edge, facing down
  } else if (p <= 2 * width + height) {
    x = width - (p - (width + height));
    y = height;
    rotation = 180; // Bottom edge, facing left
  } else {
    x = 0;
    y = height - (p - (2 * width + height));
    rotation = 270; // Left edge, facing up
  }
  
  return { x, y, rotation };
};

const VinylBorderMarquee = ({ data, baseSpeed = 50, scrollMultiplier = 0.7 }) => {
    const containerRef = useRef();
    const childRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const letterRefs = useRef([]);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const progress = useRef(0);

    useAnimationFrame((time, delta) => {
        const container = containerRef.current;
        const child = childRef.current;
        if (!container || !child) return;

        const velocity = Math.abs(scrollVelocity.get());
        const currentSpeed = baseSpeed + (velocity * scrollMultiplier);
        progress.current += (currentSpeed * delta) / 1000;

        const { offsetWidth: width, offsetHeight: height } = container;
        if (width === 0 || height === 0) return;
        
        if (dimensions.width !== width || dimensions.height !== height) {
            setDimensions({ width, height });
        }

        // Calculate letter positions and build mask in single loop
        const letterSpacing = 12;
        const letterSize = 30;
        let perimeter = 2 * (width + height);
        let sectionLength = perimeter / data.length;

        const borderOverlay = container.querySelector('.border-overlay');
        let maskParts = ['linear-gradient(black, black)'];
        let refIndex = 0;
        
        data.forEach((word, wordIndex) => {
            const wordProgress = (progress.current + wordIndex * sectionLength) % perimeter;
            [...word].forEach((letter, letterIndex) => {
                const letterProgress = wordProgress + (letterIndex * letterSpacing);
                const position = getPositionOnRect(letterProgress, width, height);
                
                // Update letter DOM directly
                const letterEl = letterRefs.current[refIndex];
                if (letterEl) {
                    letterEl.style.transform = `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%)) rotate(${position.rotation}deg)`;
                }
                
                // Build mask gradient
                maskParts.push(`radial-gradient(circle ${letterSize}px at ${position.x}px ${position.y}px, transparent ${letterSize}px, black ${letterSize}px)`);
                
                refIndex++;
            });
        });

        // Apply the mask
        if (borderOverlay) {
            borderOverlay.style.maskImage = maskParts.join(', ');
            borderOverlay.style.webkitMaskImage = maskParts.join(', ');
            borderOverlay.style.maskComposite = 'intersect';
            borderOverlay.style.webkitMaskComposite = 'source-in';
        }
    })

    return (
        <div
            ref={containerRef}
            className="flex relative h-screen w-full"
        >
            <div className="border-overlay absolute inset-0 border-6 border-white pointer-events-none" />
            <div ref={childRef} className="animated-child absolute text-white pointer-events-none" style={{ willChange: 'transform' }}>
                {data.map((word, wordIndex) => 
                    [...word].map((letter, letterIndex) => {
                        const globalIndex = data.slice(0, wordIndex).reduce((sum, w) => sum + w.length, 0) + letterIndex;
                        return (
                            <span
                                key={`${wordIndex}-${letterIndex}`}
                                ref={el => letterRefs.current[globalIndex] = el}
                                className="absolute"
                                style={{ willChange: 'transform' }}
                            >
                                {letter}
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default VinylBorderMarquee;