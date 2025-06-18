import HeroButton from './HeroButton.tsx';

export default function Hero() {

    return (
        <section className='px-12 py-8 w-full h-[calc(100vh_-_60px)] relative overflow-x-hidden flex sm:block justify-center'>
            {/* Blurred blob effect */}
            <div className='absolute -right-32 top-1/4 w-[500px] h-[500px] bg-[var(--main)] opacity-45 blur-[150px] rounded-full z-0' />
            {/* Content */}
            <div className='w-[min(375px,_90%)] h-full gap-12 flex flex-col items-center'>
                <h1 className='mt-16 text-[3.2rem] leading-[3.9rem] font-bold'>
                    <span className='block'>Hodnoť školy.</span>
                    <span className='block text-[var(--accent)]'>Upřímně.</span>
                    <span className='block text-[var(--main)]'>Anonymně.</span>
                </h1>
                <p className='leading-8'>
                    Dej své škole hlas. Přečti si zkušenosti ostatních studentů. 
                    Společně tvoříme férovější školní svět.
                </p>
                <HeroButton title='Procházet školy' />
            </div>
        </section>
    );
}