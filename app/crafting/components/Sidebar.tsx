'use client';
import { useState, useEffect } from 'react';
import { HistoryEntry } from '../../types'
import { p } from 'motion/react-client';

interface SidebarProps {
    history: HistoryEntry[];
    onSelectEntry: (entry: HistoryEntry) => void
};

export default function Sidebar({ history, onSelectEntry }: SidebarProps){
    const [sidebarState, setSidebarState] = useState(true);

    const toggleSidebar = () => setSidebarState(!sidebarState);

    useEffect(() => {
        if(history.length > 0){
            setSidebarState(false)
        }
    }, [history]);

    return(
        <div>
            <aside className= {`fixed right-0 top-0 z-20 rounded-l-lg flex flex-col bg-white text-black transition-all duration-300 ease-in-out ${sidebarState ? 'w-20' : 'w-92'} h-screen p-4`}>
                <ul>
                    {history.map((item, index) => (
                        <li className= 'cursor-pointer p-3 border-b border-gray-300 transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-50' key={index} onClick={() => onSelectEntry(item)}>
                            <p className='font-bold'>{item.selectedItem}: {item.quantity}</p>
                            {Object.entries(item.rawMaterials).map(([name, data]) => (
                                <p key={name} className='pl-4'>{name}: {data.quantity}</p>
                            ))}
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}