import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useRef, type FormEvent } from 'react';
import { createUserWithEmailAndPassword, type User } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { useUser } from '../contexts/UserContext.tsx';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.tsx';

export default function SignupPage() {

    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const { user } = useUser();

    useEffect(() => {
        document.title = 'Registrace | Školometr';
        emailRef.current?.focus();
    }, []);

    if (user) return <Navigate to='/' />

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) return alert('E-Mail nebo heslo chybí.');

        async function signIn(): Promise<User | null> {
            try {
                const credentials = await createUserWithEmailAndPassword(auth, email as string, password as string);
                return credentials.user;

            } catch(err) {
                console.error(err);
                return null;
            }
        }

        const authenticatedUser = await signIn();
        console.log(authenticatedUser);
        if (authenticatedUser) navigate('/');
    }

    return (
        <>
            <Nav />
            <main className='py-16 w-full h-fit min-h-[calc(100vh_-_60px)] flex justify-center items-center'>
                <div className='p-4 w-[250px] h-fit border-1 rounded-2xl'>
                    <form onSubmit={handleSubmit} className='w-full h-full gap-4 flex flex-col items-center'>

                        <h1 className='mb-4 text-[1.4rem] font-medium'>Vítej na Školometru!</h1>
                        <input
                            type="email"
                            ref={emailRef}
                            placeholder='E-Mail...'
                            className='px-4 py-2 w-[min(200px,_80%)] border-1 outline-2 outline-transparent focus:outline-[var(--accent)] rounded-xl transition-[outline-color] duration-200'
                        />
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder='Heslo...'
                            className='px-4 py-2 w-[min(200px,_80%)] border-1 outline-2 outline-transparent focus:outline-[var(--accent)] rounded-xl transition-[outline-color] duration-200'
                        />
                        <p className='text-[0.75rem] gap-1 flex'>
                            Už máš účet?
                            <Link to='/auth/login' className='text-[var(--accent)]'>Přihlaš se</Link>
                        </p>
                        <button className='mt-2 p-2 hover:text-[var(--accent)] outline-0 cursor-pointer transition-colors duration-200'>Zaregistrovat se</button>

                    </form>
                </div>
            </main>
        </>
    );
}