'use client'
import Link from "next/link";
import { motion } from 'motion/react';
 
export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* <div className="absolute inset-0 bg-black opacity-30"></div> */}
      <div>
        <motion.div
        initial = {{ opacity: 0, y: 50 }}
        animate = {{ opacity: 1, y: 0 }} 
        // transition={{ duration: 0.5, ease:'easeOut' }}
        transition={{ type: 'spring', stiffness: 100,damping: 15 }}
        className="relative z-10 py-4">
          <div className="border-4 border-white text-white rounded-sm p-4 flex justify-center w-fit mx-auto drop-shadow-lg backdrop-blur-xs bg-white/10">
            <h1 className="font-[family-name:var(--font-minecraft)] text-4xl">CREEPER TOOLS</h1>
          </div>
          <div className="border-4 border-white text-white rounded-lg w-fit  mx-auto justify-center p-4 m-8 grid grid-cols-2 md:grid-cols-5 grid-rows-6 drop-shadow-2xl backdrop-blur-xs bg-white/20 font-[family-name:var(--font-minecraft)]">
            <Link className="border-4 rounded-lg mx-4 p-6 text-center border-rose-900 bg-rose-900/30 font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-black/70 " href="/nether">Nether</Link>
            <Link className="border-4 rounded-lg mx-4 p-6 text-center border-yellow-500 bg-yellow-500/30 font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-black/70 " href="/crafting">Crafting</Link>
            {/* <Link className="border-4 rounded-lg mx-4 p-2 text-center border-violet-600 bg-violet-600/30 font-semibold" href="/enchantments">Enchantments</Link> */}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
