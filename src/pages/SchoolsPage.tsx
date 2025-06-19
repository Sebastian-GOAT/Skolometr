import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { type SchoolType } from '../types/SchoolType.ts';
import Nav from '../components/Nav.tsx';
import SchoolCard from '../components/SchoolCard.tsx';
import AIChat from '../components/AIChat.tsx';
import { IoChatbubbleOutline } from "react-icons/io5";
import type { RatingType } from '../types/RatingType.ts';

export default function SchoolsPage() {

    const [isChatClosed, toggleChat] = useState<boolean>(true);

    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [ratings, setRatings] = useState<RatingType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        document.title = 'Školy | Školometr';
        async function getSchools(): Promise<void> {
            try {
                const querySnapshot = await getDocs(collection(db, 'schools'));
                const fetchedSchools: SchoolType[] = querySnapshot.docs.map(doc => doc.data() as SchoolType);
                setSchools(fetchedSchools);
            } catch(err) {
                console.error(err);
            }
        }
        async function getRatings(): Promise<void> {
            try {
                const querySnapshot = await getDocs(collection(db, 'ratings'));
                const fetchedRatings: RatingType[] = querySnapshot.docs.map(doc => doc.data() as RatingType);
                setRatings(fetchedRatings);
            } catch(err) {
                console.error(err);
            }
        }
        async function loadData(): Promise<void> {
            try {
                await getSchools();
                await getRatings();
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <>
            <Nav />
            <main className='w-full'>
                {
                    isLoading ? (
                        <section className='w-full h-[calc(100vh_-_60px)] flex justify-center items-center'>
                            <h1 className='text-[1.3rem]'>
                                Načítání...
                            </h1>
                        </section>
                    ) : (
                        <>
                            <section className='mt-12 px-12 py-8 w-full gap-8 grid grid-cols-[repeat(auto-fit,_275px)] place-items-center justify-center'>
                                {
                                    schools.map((school, i) => (
                                        <SchoolCard key={i} {...school} />
                                    ))
                                }
                            </section>
                            <AIChat
                                schools={schools}
                                ratings={ratings}
                                hidden={isChatClosed}
                            />
                            <div
                                className='aspect-square w-16 fixed bottom-4 right-4 z-50 text-[1.25rem] bg-[var(--bg-theme-toggle)] rounded-xl flex justify-center items-center cursor-pointer'
                                onClick={() => toggleChat(state => !state)}
                            >
                                <IoChatbubbleOutline size={35} />
                            </div>
                        </>
                    )
                }
            </main>
        </>
    );
}