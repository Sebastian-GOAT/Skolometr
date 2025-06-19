import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type SchoolType } from '../types/SchoolType.ts';
import { type RatingType } from '../types/RatingType.ts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import Nav from '../components/Nav.tsx';
import ImageSlider from '../components/ImageSlider.tsx';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { FaLocationDot } from "react-icons/fa6";
import CommentSection from '../components/CommentSection.tsx';
import Map from '../components/Map.tsx';

type SchoolTypeWithId = SchoolType & { id: string };

export default function SchoolDetailPage() {

    const schoolName: string = decodeURIComponent(useParams().school as string);

    const [comments, setComments] = useState<RatingType[]>([]);
    const [isFound, setIsFound] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [school, setSchool] = useState<SchoolTypeWithId | null>(null);
    const [images, setImages] = useState<string[] | null>(null);

    useEffect(() => {
        async function getSchool(): Promise<SchoolTypeWithId | void> {
            try {
                const q = query(collection(db, 'schools'), where('title', '==', schoolName));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    console.warn('Škola nebyla nalezena.');
                    return;
                }

                const snap = querySnapshot.docs[0];
                const data = snap.data() as SchoolType;

                setSchool({ ...data, id: snap.id });
                setImages(data.images);
                setIsFound(true);
            } catch(err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        async function getComments(): Promise<any> {
            try {
                const q = query(collection(db, 'ratings'), where('school', '==', schoolName));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) return;

                const snap = querySnapshot.docs;
                const data = snap.map(doc => ({ ...(doc.data() as RatingType) }));

                setComments(data);
            } catch(err) {
                console.error(err);
            }
        }
        getSchool();
        getComments();
    }, [schoolName]);

    function getRatingEmoji(rating: number): string {
        if (rating <= 2) return '😞';
        else if (rating <= 3) return '😐';
        else if (rating <= 4) return '🙂';
        else if (rating <= 4.5) return '😃';
        else return '🤩';
    }

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

                    ) : isFound && school ? (

                        <>
                            {/* Top section */}

                            <section className='w-full flex flex-col md:flex-row items-stretch'>
                                <div className='py-8 w-full md:w-1/2 flex justify-center'>
                                    <ImageSlider width='min(450px, 80%)' images={images} />
                                </div>
                                <div className='py-8 w-full md:w-1/2 gap-2 flex flex-col justify-center items-center'>
                                    <h1 className='text-[2rem] font-medium'>
                                        {school.title}
                                    </h1>
                                    <div>
                                        <h2 className='max-w-[350px] text-[1.3rem] gap-2 font-medium flex items-center'>
                                            <FaLocationDot />
                                            <span className='opacity-60 text-center'>
                                                {school.adress}
                                            </span>
                                        </h2>
                                    </div>
                                    <div className='mt-4 gap-2 flex flex-col items-center'>
                                        <Rating
                                            className='max-w-[175px]'
                                            value={school.rating}
                                            readOnly
                                        />
                                        <h3 className='text-[1.6rem] font-medium'>
                                            {school.rating.toFixed(1)} / 5 {getRatingEmoji(school.rating)}
                                        </h3>
                                    </div>
                                </div>
                            </section>

                            {/* Comment & map section */}

                            <section className='w-full flex flex-col md:flex-row items-stretch'>
                                <div className='py-24 w-full md:w-1/2 flex justify-center'>
                                    <CommentSection schoolName={schoolName} schoolId={school.id} comments={comments} />
                                </div>
                                <div className='py-24 w-full md:w-1/2 flex justify-center'>
                                    <Map
                                        className='w-4/5 h-[400px]'
                                        lat={school.lat}
                                        lon={school.lon}
                                    />
                                </div>
                            </section>
                        </>
                            
                    ) : (
                            
                        <section className='px-8 w-full h-[calc(100vh_-_60px)] flex flex-col justify-center items-center'>
                            <h1 className='text-[4.5rem] bg-gradient-to-tr from-[var(--main)] to-[var(--accent)] bg-clip-text text-transparent font-bold'>
                                404
                            </h1>
                            <h2 className='text-[1.7rem] text-center'>
                                Škola nebyla nalezena 😢
                            </h2>
                        </section>

                    )
                }
            </main>
        </>
    );
}