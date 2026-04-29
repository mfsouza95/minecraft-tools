'use client'
import { useState } from 'react';

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

  const handleCopy = async(text, type) => {
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
    <div className='pl-4 py-8'>
      <h1>Coords Calculations</h1>
      <div className='my-8'>
        <h2>Choose your current dimension: </h2>
        <button onClick={() => setDimension('Overworld')} className ='p-8 m-8 rounded-sm outline-2 outline-lime-500'>Overworld</button>
        <button onClick={() => setDimension('Nether')} className ='p-8 m-8 rounded-sm outline-2 outline-indigo-500'>Nether</button>
      </div>
      <div>
        <label htmlFor='X' className='p-2'>X:</label>
        <input type='number' id='x' name='X' className='bg-white text-black' onChange={(e) => setCords({...cords, x: Number(e.target.value)})}></input>
        <label htmlFor='Y' className='p-2'>Y:</label>
        <input type='number' id='Y' name='Y' className='bg-white text-black' onChange={(e) => setCords({...cords, y: Number(e.target.value)})}></input>
        <label htmlFor='Z' className='p-2'>Z:</label>
        <input type='number' id='Z' name='Z' className='bg-white text-black' onChange={(e) => setCords({...cords, z: Number(e.target.value)})}></input>
      </div>
      <div className='m-8'>
        <h1>{dimension === 'Overworld' ? 'Nether' : 'Overworld'} Coords:</h1>
        <p>X:{resultCords.x}</p>
        <p>Y:{resultCords.y}</p>
        <p>Z:{resultCords.z}</p>
      </div>
      <div className='pl-4'>
        <button onClick={() => handleCopy(cordsCopy, 'coords')} className='px-8 mx-8 rounded-sm outline-2 bg-white text-black'>{copyStatus.coords ? 'Copied' : 'Copy Coordinates'}</button>
        <button onClick={() => handleCopy(tpCopy, 'tp')} className='px-8 mx-8 rounded-sm outline-2 bg-white text-black'>{copyStatus.tp ? 'Copied' : 'Copy /TP command'}</button>
      </div>
    </div>
  );
}