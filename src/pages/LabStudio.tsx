import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export default function LabStudio() {
    const { setLabOpen } = useAppStore();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'close-lab') {
                setLabOpen(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setLabOpen]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <iframe 
                src="/lab.html" 
                className="w-full h-full border-none outline-none bg-black"
                title="Circuit.IQ Virtual Lab"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
}
