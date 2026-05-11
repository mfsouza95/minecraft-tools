'use client';
import { useState, useEffect } from 'react';
import { HistoryEntry } from '../../types'
import { p } from 'motion/react-client';

interface SidebarProps {
    historyEntries: HistoryEntry[];
    onSelectEntry: (entry: HistoryEntry) => void;
    onClearHistory: () => void;
    onClearEntry: (index: number) => void;
};

function exportHistory(historyEntries: HistoryEntry[]){
    const result: Record<string, number> = {};

    for (const entry of historyEntries){
        for (const [name, data] of Object.entries(entry.rawMaterials)) {
            result[name] = (result[name] ?? 0) + data.quantity;
        }
    };
    return result;
};

export default function Sidebar({ historyEntries, onSelectEntry, onClearHistory, onClearEntry }: SidebarProps){
    const [sidebarState, setSidebarState] = useState(true);

    const handleExport = (historyEntries: HistoryEntry[]) => {
        const result = exportHistory(historyEntries);
        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'materials.json';
        a.click()
        URL.revokeObjectURL(url);
    }   

    const backButton = sidebarState ? '<' : '>';

    const toggleSidebar = () => setSidebarState(!sidebarState);
    
    useEffect(() => {
        if(historyEntries.length > 0){
            setSidebarState(false)
        }
    }, [historyEntries]);

    return(
        <div>
            <aside className= {`fixed right-0 top-0 z-20 rounded-l-lg flex flex-col bg-white text-black transition-all duration-300 ease-in-out ${sidebarState ? 'w-20' : 'w-92'} h-screen p-4`}>
                <div className='grid grid-cols-6 pb-4'>
                    <input type="button" value={backButton} className='absolute size-10 text-3xl font-bold border-2 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-200'
                        onClick={toggleSidebar}
                    />
                    <h1 className={`text-center font-bold text-3xl pb-4 col-span-4 col-start-2 ${sidebarState? 'invisible' : 'visible' }`}>History:</h1>
                </div>
                <ul>
                    {historyEntries.map((item, index) => (
                        <li className= {`relative cursor-pointer p-3 border-b border-gray-300 transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-50 ${sidebarState? 'invisible' : 'visible' }`} key={index} onClick={() => onSelectEntry(item)}>
                            <p className='font-bold'>{item.selectedItem}: {item.quantity}</p>
                            {Object.entries(item.rawMaterials).map(([name, data]) => (
                                <p key={name} className='pl-4'>{name}: {data.quantity}</p>
                            ))}
                            <input type="button" value="🗑️" className='absolute top-px right-px rounded-lg flex items-center justify-center cursor-pointer text-lg'
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearEntry(index);
                            }}
                            />
                        </li>
                    ))}
                </ul>
                <div className={`mt-auto grid grid-cols-2 gap-2 h-12 ${sidebarState? 'invisible' : 'visible' }`}>
                    <input type="button" value="Clear History" className='border-2 border-black cursor-pointer rounded-lg transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-200'
                    onClick={onClearHistory}
                    />
                    <input type="button" value="Export Raw Materials" className='border-2 border-black cursor-pointer rounded-lg transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-200'
                    onClick={() => handleExport(historyEntries)}
                    />
                </div>
            </aside>
        </div>
    );
}