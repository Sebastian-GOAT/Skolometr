import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useUser } from '../contexts/UserContext.tsx';
import { type RatingType } from '../types/RatingType.ts';
import { type RequestOptionsType } from '../types/RequestOptionsType.ts';
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from '../../firebase.ts';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { Navigate } from 'react-router-dom';
import Nav from '../components/Nav.tsx';
import Comment from '../components/Comment.tsx';
import defaultImage from '../assets/defaultImage.png';

export default function AccountPage() {

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { user, loading: isUserLoading } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<RatingType[]>([]);

    useEffect(() => {
        async function getUsersComments(): Promise<void> {
            try {
                if (!user) return;

                const q = query(collection(db, "ratings"), where("email", "==", user.email));

                const querySnapshot = await getDocs(q);
                const fetchedComments = querySnapshot.docs.map(doc => ({ ...doc.data() } as RatingType));

                setComments(fetchedComments);
            } catch(err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        getUsersComments();
    }, [user]);

    function truncateEmail(text: string, maxLength: number): string {
        return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
    }

    function handleResetPassword() {
        async function reset(): Promise<void> {
            try {
                if (!user) return;
                await sendPasswordResetEmail(auth, user.email as string);
                alert('E-Mail pro obnovu hesla byl odeslán.');
            } catch (err) {
                console.error(err);
            }
        }
        reset();
    }

    function handleLogout() {
        async function logout(): Promise<void> {
            try {
                await signOut(auth);
            } catch(err) {
                console.error(err);
            }
        }
        logout();
    }

    async function handleProfilePictureChange(e: ChangeEvent<HTMLInputElement>) {
        function fileToDataURL(file: File): Promise<string> {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        }
        async function getURLFromImgur() {
            try {
                const file = e.target.files?.[0];
                if (!file) return;

                const dataURL = await fileToDataURL(file);
                const base64 = dataURL.split(',')[1];

                const options: RequestOptionsType<'POST'> = {
                    method: 'POST',
                    headers: {
                        Authorization: `Client-ID ${import.meta.env.IMGUR_CLIENT_ID}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: base64,
                        type: 'image/png'
                    })
                };

                const res = await fetch('https://api.imgur.com/3/image', options);
                if (!res.ok) throw new Error('Failed to get the image url.');

                const data = await res.json();
                return data.data.link;
            } catch(err) {
                console.error(err);
            }
        }
        async function changeProfilePicture() {
            try {
                const imgUrl = await getURLFromImgur();
                if (!imgUrl || !user?.uid) return;

                const userDocRef = doc(db, "users", user.uid);

                await updateDoc(userDocRef, { photoURL: imgUrl });
            } catch (err) {
                console.error(err);
            }
        }
        changeProfilePicture();
    }

    if (isUserLoading) return (
        <>
            <Nav />
            <main className='w-full h-[calc(100vh_-_60px)] flex justify-center items-center'>
                <h1 className='text-[1.3rem]'>
                    Načítání...
                </h1>
            </main>
        </>
    );

    if (!user) return <Navigate to='/auth/login' />

    return (
        <>
            <Nav />
            <main className='w-full'>

                <section className='w-full flex flex-col lg:flex-row'>
                    <div className='py-16 w-full lg:w-[350px] flex justify-center'>
                        {/* Account details */}
                        <div className='p-8 w-[275px] h-fit gap-8 bg-[var(--bg-theme-toggle)] flex flex-col items-center rounded-2xl'>
                            <input
                                type='file'
                                ref={imageInputRef}
                                onChange={handleProfilePictureChange}
                                hidden
                            />
                            <img
                                src={user.photoURL || defaultImage}
                                alt='pfp'
                                className='block aspect-square w-36 border-3 rounded-full cursor-pointer'
                                onClick={() => imageInputRef.current?.click()}
                            />
                            <h1 className='text-[1.2rem] font-bold'>
                                {truncateEmail(user.email as string, 20)}
                            </h1>
                            <div className='gap-4 flex flex-col items-center'>
                                <button
                                    onClick={handleLogout}
                                    className='px-4 py-2 bg-gradient-to-r hover:bg-gradient-to-l from-[var(--main)] to-[var(--accent)] rounded-full cursor-pointer'
                                >
                                    Odhlásit se
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className='px-4 py-2 border-1 text-[0.75rem] hover:bg-[var(--text)] hover:text-[var(--bg)] rounded-full cursor-pointer transition-colors duration-200'
                                >
                                    Změnit heslo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-[calc(100%_-_350px)]'>
                        {/* Greeting */}
                        <div className='hidden lg:flex w-full h-24 justify-center items-center'>
                            <h1 className='text-[2.5rem] font-bold'>
                                Vítej zpět!
                            </h1>
                        </div>
                        {/* Users ratings */}
                        <div className='py-16 w-full gap-8 flex flex-col justify-center items-center'>
                            {
                                isLoading ? (
                                    <h1 className='text-[1.3rem]'>
                                        Načítání...
                                    </h1>
                                ) : (
                                    <>
                                        <h1 className='text-[1.4rem] font-medium'>
                                            Vaše hodnocení
                                        </h1>
                                        <div className='px-4 pb-8 w-[300px] border-1 rounded-xl'>
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
                                    </>
                                )
                            }
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}