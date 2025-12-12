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

const ProcessingLetter = ({ letter, letterPositions, wordIndex, letterIndex }) => {
    const letterRef = useRef();

    useAnimationFrame(() => {
        if (!letterRef.current) return;
        
        const position = letterPositions.current[wordIndex]?.[letterIndex];
        if (!position) return;
        
        const { x, y, rotation } = position;
        letterRef.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%)) rotate(${rotation}deg)`;
    });

    return (
        <span
            ref={letterRef}
            className="absolute"
        >
            {letter}
        </span>
    );
}

const VinylBorderMarquee = ({ data, baseSpeed = 50, scrollMultiplier = 0.7 }) => {
    const containerRef = useRef();
    const childRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const progress = useRef(0);
    const letterPositions = useRef(data.map(word => Array(word.length).fill(null)));

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
        
        data.forEach((word, wordIndex) => {
            const wordProgress = (progress.current + wordIndex * sectionLength) % perimeter;
            [...word].forEach((letter, letterIndex) => {
                const letterProgress = wordProgress + (letterIndex * letterSpacing);
                const position = getPositionOnRect(letterProgress, width, height);
                
                // Store position for letter components
                letterPositions.current[wordIndex][letterIndex] = position;
                
                // Build mask gradient at same time
                maskParts.push(`radial-gradient(circle ${letterSize}px at ${position.x}px ${position.y}px, transparent ${letterSize}px, black ${letterSize}px)`);
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
                    [...word].map((letter, letterIndex) => 
                        <ProcessingLetter 
                            key={`${wordIndex}-${letterIndex}`}
                            letter={letter}
                            letterPositions={letterPositions}
                            wordIndex={wordIndex}
                            letterIndex={letterIndex}
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default VinylBorderMarquee;