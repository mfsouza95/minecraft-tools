'use client'
import { useState } from 'react';
import { motion } from 'motion/react';

export default function PortalCalc() {
  const [dimension, setDimension] = useState('Overworld');
  const [cords, setCords] = useState({x: 0, y: 0, z: 0});
  const [copyStatus, setCopyStatus] = useState({coords:false, tp:false});
  let resultCords = {x:0, y:0, z:0};

  if(dimension === 'Overworld'){
    resultCords = {x: Math.floor(cords.x/8), y:cords.y, z: Math.floor(cords.z/8)};
  } else {
    resultCords = {x: Math.floor(cords.x*8), y:cords.y, z: Math.floor(cords.z*8)};
  }

  let cordsCopy = `${resultCords.x} ${resultCords.y} ${resultCords.z}`;
  let tpCopy = `/tp ${resultCords.x} ${resultCords.y} ${resultCords.z}`;

  const handleCopy = async(text: string, type: string) => {
    try{
      await navigator.clipboard.writeText(text);

      setCopyStatus((prev) => ({...prev, [type]: true}));
      setTimeout(() => {
        setCopyStatus((prev) => ({...prev, [type]:false}));
      }, 2000);
    } catch(err){
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className='pl-4 py-8 pt-12 text-white'>
      <div className="absolute inset-0 z-[-1]"></div>
      <motion.div
        initial = {{ opacity: 0, y: 50 }}
        animate = {{ opacity: 1, y: 0 }} 
        // transition={{ duration: 0.5, ease:'easeOut' }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative z-10 py-4 text-center"
      >
        <h1 className='font-bold text-3xl font-(family-name:--font-minecraft)'>Coords Calculations</h1>
        <div className='border-4 rounded-lg drop-shadow-lg backdrop-blur-xs bg-white/20 my-6 py-6 px-6 w-fit mx-auto'>
          <div className='my-8 font-semibold'>
            <h2>Choose your current dimension: </h2>
            <button onClick={() => setDimension('Overworld')} className ='p-8 m-8 rounded-sm outline-3 outline-lime-500 bg-lime-500/20 cursor-pointer transition-all hover:scale-105 active:shadow-lg active:shadow-black/70 md:hover:shadow-lg md:hover:shadow-black/70'>Overworld</button>
            <button onClick={() => setDimension('Nether')} className ='p-8 m-8 rounded-sm outline-3 outline-indigo-500 bg-indigo-500/20 cursor-pointer transition-all hover:scale-105 active:shadow-lg active:shadow-black/70 md:hover:shadow-lg md:hover:shadow-black/70'>Nether</button>
          </div>
          <div className='font-semibold grid grid-cols-1 gap-3 md:grid-cols-3'>
            <div>
              <label htmlFor='X' className='p-2'>X:</label>
              <input type='number' id='x' name='X' className='bg-white text-black rounded-sm no-arrows' onChange={(e) => setCords({...cords, x: Number(e.target.value)})}></input>
            </div>
            <div>
              <label htmlFor='Y' className='p-2'>Y:</label>
              <input type='number' id='Y' name='Y' className='bg-white text-black rounded-sm no-arrows' onChange={(e) => setCords({...cords, y: Number(e.target.value)})}></input>
            </div>
            <div>
              <label htmlFor='Z' className='p-2'>Z:</label>
              <input type='number' id='Z' name='Z' className='bg-white text-black rounded-sm no-arrows' onChange={(e) => setCords({...cords, z: Number(e.target.value)})}></input>
            </div>
          </div>
          <div className='m-8 font-semibold'>
            <h1>{dimension === 'Overworld' ? 'Nether' : 'Overworld'} Coords:</h1>
            <p>X:{resultCords.x}</p>
            <p>Y:{resultCords.y}</p>
            <p>Z:{resultCords.z}</p>
          </div>
        </div>
        <div className='flex justify-center'> 
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 w-fit'>
            <button onClick={() => handleCopy(cordsCopy, 'coords')} className='p-6 mx-8 rounded-sm outline-2 bg-white text-black cursor-pointer transition-all hover:scale-105 active:shadow-lg active:shadow-black/70 md:hover:shadow-lg md:hover:shadow-black/70'>{copyStatus.coords ? 'Copied' : 'Copy Coordinates'}</button>
            <button onClick={() => handleCopy(tpCopy, 'tp')} className='p-6 mx-8 rounded-sm outline-2 bg-white text-black cursor-pointer transition-all hover:scale-105 active:shadow-lg active:shadow-black/70 md:hover:shadow-lg md:hover:shadow-black/70'>{copyStatus.tp ? 'Copied' : 'Copy /TP command'}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}