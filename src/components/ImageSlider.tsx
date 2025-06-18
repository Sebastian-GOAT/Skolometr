import { useState } from 'react';

export default function ImageSlider({ images, width }: { images: string[] | null; width: string; }) {

    if (!images) {
        images = [];
    }

    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((current + 1) % images.length);
    const prevSlide = () => setCurrent((current - 1 + images.length) % images.length);

    return (
        <div style={{ width }} className='aspect-[3/2] relative overflow-hidden rounded-xl'>
            {images.map((image, i) => (
                <img
                    key={i}
                    src={image}
                    alt={`Slide ${i + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'} transition-opacity duration-1000`}
                />
            ))}

            <button
                onClick={prevSlide}
                className='w-10 absolute aspect-square left-4 top-1/2 -translate-y-1/2 z-20 text-[1.5rem] bg-black/40 text-white rounded-full cursor-pointer'
            >
                ‹
            </button>
            <button
                onClick={nextSlide}
                className='w-10 absolute aspect-square right-4 top-1/2 -translate-y-1/2 z-20 text-[1.5rem] bg-black/40 text-white rounded-full cursor-pointer'
            >
                ›
            </button>
            <span className='absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-white'>
                {current + 1}/{images.length}
            </span>
        </div>
    );
}