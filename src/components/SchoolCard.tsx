import { useNavigate } from 'react-router-dom';
import { type SchoolType } from '../types/SchoolType.ts';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

export default function SchoolCard({ title, adress, rating, imgSrc }: SchoolType) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/skoly/${encodeURIComponent(title)}`)}
            className='aspect-[2/3] w-[250px] hover:scale-102 bg-[var(--bg-school-card)] rounded-2xl cursor-pointer transition-transform duration-300'
        >
            <div className='w-full h-1/2 flex justify-center items-center'>
                <img
                    src={imgSrc}
                    alt='Fotka školy'
                    className='min-w-full min-h-full object-cover rounded-t-2xl'
                />
            </div>
            <div className='p-4 w-full h-1/2 gap-4 flex flex-col'>
                <h1 className='text-[1.25rem] font-medium'>{title}</h1>
                <h3 className=''>{adress}</h3>
                <div className='w-full gap-2 flex items-center'>
                    <Rating
                        className='max-w-[125px]'
                        value={rating}
                        readOnly
                    />
                    <span className='text-[1.2rem] font-medium'>{rating}</span>
                </div>
            </div>
        </div>
    );
}