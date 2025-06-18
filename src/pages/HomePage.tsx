import { useEffect } from 'react';
import Nav from '../components/Nav.tsx';
import Hero from '../components/Hero.tsx';

export default function HomePage() {

    useEffect(() => {
        document.title = 'Domů | Školometr';
    }, []);

    return (
        <>
            <Nav />
            <main className='w-full'>
                <Hero />
            </main>
        </>
    );
}