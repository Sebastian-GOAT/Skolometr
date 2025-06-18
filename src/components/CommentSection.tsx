import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useUser } from '../contexts/UserContext.tsx';
import { collection, addDoc, doc, updateDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { type RatingType } from '../types/RatingType.ts';
import TextareaAutosize from 'react-textarea-autosize';
import defaultImage from '../assets/defaultImage.png';
import { Rating } from '@smastrom/react-rating';
import Comment from './Comment.tsx';

export default function CommentSection({ schoolName, schoolId, comments }: { schoolName: string; schoolId: string; comments: RatingType[]; }) {

    const { user } = useUser();
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(1);

    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {

    }, [schoolName]);

    async function updateRatingAverage(): Promise<void> {
        try {
            const q = query(
                collection(db, 'ratings'),
                where('school', '==', schoolName)
            );
            const snapshot = await getDocs(q);

            const ratings = snapshot.docs.map(doc => doc.data().rating as number);

            const sum = ratings.reduce((a, b) => a + b, 0);
            const avg = parseFloat((sum / ratings.length).toFixed(1));

            const schoolRef = doc(db, 'schools', schoolId);
            await updateDoc(schoolRef, { rating: avg });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            const userMessage = messageRef.current?.value?.trim();
            const userEmail = isAnonymous ? 'Anonym' : user?.email || 'Anonym'
            const userPhoto = isAnonymous ? null : user?.photoURL || null;

            if (!userMessage || userMessage.length === 0) {
                alert('Komentář nemůže být prázdný.');
                return;
            }

            const ratingData = {
                school: schoolName,
                message: userMessage,
                rating,
                email: userEmail,
                photoURL: userPhoto,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'ratings'), ratingData);
            await updateRatingAverage();

            if (messageRef.current) {
                messageRef.current.value = '';
            }
            setRating(1);
            setIsAnonymous(false);

            alert('Hodnocení bylo odesláno!');
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className='p-4 w-[350px] border-1 rounded-2xl'>
            <h1 className='mb-4 text-[1.1rem] font-medium'>
                Hodnocení
            </h1>
            {/* Add comment */}
            <div className='pt-4 w-full border-1 border-[var(--main)]'>
                <form onSubmit={handleSubmit}>
                    {/* Profile picture and username */}
                    <div className='px-4 py-1 w-full gap-2 flex items-center'>
                        <img
                            src={user?.photoURL && !isAnonymous ? user?.photoURL : defaultImage}
                            alt='pfp'
                            className='block aspect-square w-8 rounded-full'
                        />
                        <span>
                            {user?.email && !isAnonymous ? user?.email : 'Anonym'}
                        </span>
                    </div>
                    {/* Textarea */}
                    <div className='p-2 w-full gap-4 flex flex-col justify-center items-center'>
                        <TextareaAutosize
                            ref={messageRef}
                            minRows={1}
                            maxRows={4}
                            className='p-2 w-9/10 resize-none outline-0'
                            placeholder='Váš komentář...'
                        />
                        <Rating
                            className='max-w-[120px]'
                            value={rating}
                            onChange={setRating}
                        />
                    </div>
                    {/* Bottom section (send, anonym etc.) */}
                    <div className='px-4 py-1 w-full flex justify-between'>
                        <div className='gap-2 flex items-center'>
                            <input
                                type='checkbox'
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(state => !state)}
                            />
                            <label>Anonymní</label>
                        </div>
                        <button className='p-2 cursor-pointer'>
                            Odeslat
                        </button>
                    </div>
                </form>
            </div>
            {/* Comments */}
            <div className='w-full flex flex-col gap-4'>
                {
                    comments.map((comment, i) => (
                        <Comment
                            key={i}
                            comment={comment}
                            i={i}
                        />
                    ))
                }
            </div>
        </div>
    );
}