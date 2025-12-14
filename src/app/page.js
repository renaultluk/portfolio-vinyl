"use client";

import ParallaxSection from "@/components/ParallaxSection";
import VinylBorderMarquee from "@/components/VinylBorderMarquee";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef();
  const totalSections = 4;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black">
        <div 
          ref={containerRef}
          className="h-screen w-full overflow-y-scroll"
        >
          
          {/* Vinyl Sleeve */}
          <ParallaxSection 
            scrollContainer={containerRef} 
            index={0} 
            totalSections={totalSections}
          >
            <div className="h-screen w-screen pb-10">
              <div className="h-full w-full bg-primary px-4 py-6">
                <VinylBorderMarquee
                  data={[
                    "Solutions Architect",
                    "Product Designer",
                    "Embedded Systems Engineer"
                  ]}
                  baseSpeed={10}
                  scrollContainer={containerRef}
                />
              </div>
            </div>
          </ParallaxSection>

          {/* Profile */}
          <ParallaxSection 
            scrollContainer={containerRef} 
            index={1} 
            totalSections={totalSections}
            stickyIndex={[0, 1]}
            className="bg-gray-900"
          >
            <div className="text-white text-4xl">
              Profile Section
            </div>
          </ParallaxSection>

          {/* Section 3 */}
          <ParallaxSection 
            scrollContainer={containerRef} 
            index={2} 
            totalSections={totalSections}
            className="bg-gray-800"
          >
            <div className="text-white text-4xl">
              Section 3
            </div>
          </ParallaxSection>

          {/* Section 4 */}
          <ParallaxSection 
            scrollContainer={containerRef} 
            index={3} 
            totalSections={totalSections}
            className="bg-gray-700"
          >
            <div className="text-white text-4xl">
              Section 4
            </div>
          </ParallaxSection>

        </div>
      </main>
    </div>
  );
}
