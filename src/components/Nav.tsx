import { useUser } from '../contexts/UserContext.tsx';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import defaultImage from '../assets/defaultImage.png';

export default function Nav() {

    const { user } = useUser();

    return (
        <nav className='px-6 w-full h-[60px] fixed top-0 left-0 z-50 bg-[var(--bg)] flex justify-between items-center'>

            <div className='h-full flex items-center'>
                <Link to='/'>
                    <img
                        src={logo}
                        alt='Logo'
                        className='h-full max-h-8 object-contain'
                    />
                </Link>
            </div>

            <div className='h-full gap-4 flex items-center'>
                {
                    user ? (
                        <Link to='/ucet'>
                            <img
                                src={user.photoURL ? user.photoURL : defaultImage}
                                alt='pfp'
                                className='block aspect-square h-full max-h-8 border-2 rounded-full'
                            />
                        </Link>
                    ) : (
                        <>
                            <Link
                                to='/auth/login'
                                className='hover:text-[var(--accent)] transition-colors duration-200'
                            >
                                Přihlásit se
                            </Link>
                            <Link
                                to='/auth/signup'
                                className='hover:text-[var(--accent)] transition-colors duration-200'
                            >
                                Zaregistrovat se
                            </Link>
                        </>
                    )
                }
            </div>

        </nav>
    );
}