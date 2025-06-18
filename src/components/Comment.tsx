import type { RatingType } from '../types/RatingType.ts';
import { Rating } from '@smastrom/react-rating';
import defaultImage from '../assets/defaultImage.png';

export default function Comment({ comment, i }: { comment: RatingType; i: number; }) {

    return (
        <div className={`mt-2 pt-4 w-full ${i !== 0 ? 'border-t-1' : 'border-t-0'}`}>
            {/* User info */}
            <div className='py-2 w-full gap-2 flex items-center'>
                <img
                    src={comment.photoURL || defaultImage}
                    alt='pfp'
                    className='block aspect-square w-8 rounded-full'
                />
                <span>
                    {comment.email}
                </span>
            </div>
            {/* Message */}
            <div className='px-1 py-4 w-full'>
                {comment.message}
            </div>
            {/* Rating */}
            <div className='w-full gap-2 flex items-center'>
                <Rating
                    className='max-w-2/5'
                    value={comment.rating}
                    readOnly
                />
                <span>
                    {comment.rating} / 5
                </span>
            </div>
        </div>
    );
}