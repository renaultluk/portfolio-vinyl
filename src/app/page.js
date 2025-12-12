"use client";

import VinylBorderMarquee from "@/components/VinylBorderMarquee";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-4 px-4 bg-white dark:bg-black sm:items-start">
        <VinylBorderMarquee
          data={[
            "Solutions Architect",
            "Product Designer",
            "Embedded Systems Engineer"
          ]}
          baseSpeed={10}
        />
      </main>
    </div>
  );
}
