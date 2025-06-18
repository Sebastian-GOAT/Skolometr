import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { type SchoolType } from '../types/SchoolType.ts';
import Nav from '../components/Nav.tsx';
import SchoolCard from '../components/SchoolCard.tsx';

export default function SchoolsPage() {

    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getSchools(): Promise<any> {
            try {
                const querySnapshot = await getDocs(collection(db, 'schools'));
                const fetchedSchools: SchoolType[] = querySnapshot.docs.map(doc => doc.data() as SchoolType);
                setSchools(fetchedSchools);
            } catch(err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        getSchools();
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
                        <section className='mt-12 px-12 py-8 w-full gap-8 grid grid-cols-[repeat(auto-fit,_275px)] place-items-center justify-center'>
                            {
                                schools.map((school, i) => (
                                    <SchoolCard key={i} {...school} />
                                ))
                            }
                        </section>
                    )
                }
            </main>
        </>
    );
}