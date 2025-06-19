import { useRef, useState } from 'react';
import { GEMINIChat, type GEMINIChatMessage } from '../../firebase.ts';
import { type SchoolType } from '../types/SchoolType.ts';
import { IoSend } from "react-icons/io5";
import AIChatMessage from './AIChatMessage.tsx';
import type { RatingType } from '../types/RatingType.ts';

type Props = {
    schools: SchoolType[];
    ratings: RatingType[];
    hidden: boolean;
}

export default function AIChat({ schools, ratings, hidden }: Props) {

    const [chat] = useState<GEMINIChat>(new GEMINIChat(schools, ratings));
    const [history, setHistory] = useState<GEMINIChatMessage[]>(chat.history);

    const queryRef = useRef<HTMLInputElement | null>(null);

    async function sendMessage() {
        if (!queryRef.current) return;

        const prompt = queryRef.current.value.trim();

        if (!prompt) return;

        setHistory(h => [...h, { role: 'user', parts: [{ text: prompt }] }]);

        queryRef.current.value = '';

        const res = await chat.sendMessage(prompt);
        setHistory(h => [...h, { role: 'model', parts: [{ text: res }] }]);
    }

    return (
        <div className={`aspect-[9/16] w-[300px] fixed bottom-24 right-4 ${hidden ? 'translate-x-16 translate-y-[calc(100%_+_9rem)]' : 'translate-0'} z-40 bg-[var(--bg-theme-toggle)] rounded-2xl transition-transform duration-700`}>
            <div className='w-full h-12 flex justify-center items-center'>
                <h1 className='font-medium'>
                    Pepa, asistent
                </h1>
            </div>
            <div className='w-full h-[calc(80%_-_3rem)] overflow-y-auto'>
                {history.map((message, i) => (
                    <AIChatMessage
                        key={i}
                        role={message.role}
                        message={message.parts[0].text}
                    />
                ))}
            </div>
            <div className='w-full h-1/5 gap-4 flex justify-center items-center'>
                <input
                    type='text'
                    ref={queryRef}
                    className='px-2 py-1 w-[150px] border-1 outline-0'
                />
                <IoSend
                    className='cursor-pointer'
                    size={20}
                    onClick={sendMessage}
                />
            </div>
        </div>
    );
}