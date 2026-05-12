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
            <button
                onClick={toggleSidebar}
                className='fixed top-4 right-4 z-30 size-10 text-2xl font-bold border-2 rounded-lg bg-white text-black shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer hover:bg-gray-200'
            >
                {backButton}
            </button>
            <aside className= {`fixed right-0 top-0 z-20 rounded-l-lg flex flex-col bg-white text-black shadow-2xl transition-transform duration-300 ease-in-out ${sidebarState ? 'translate-x-full' : 'translate-x-0'} h-screen p-6 w-full md:w-96 flex flex-col`}>
                <div className='flex items-center justify-between pb-4 mt-12 md:mt-0'>
                    {/* <input type="button" value={backButton} className='absolute size-10 text-3xl font-bold border-2 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-200'
                        onClick={toggleSidebar}
                    /> */}
                    <h1 className={`text-3xl font-bold`}>History:</h1>
                </div>
                <ul>
                    {historyEntries.map((item, index) => (
                        <li className= {`relative cursor-pointer p-3 border-b border-gray-300 transition-all hover:scale-105 hover:shadow-md hover:shadow-black/20 hover:bg-gray-50`} key={index} onClick={() => onSelectEntry(item)}>
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
                <div className={`mt-auto grid grid-cols-2 gap-2 h-12`}>
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