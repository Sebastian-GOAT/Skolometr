import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.tsx';

import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import SchoolsPage from './pages/SchoolsPage.tsx';
import SchoolDetailPage from './pages/SchoolDetailPage.tsx';
import AccountPage from './pages/AccountPage.tsx';

import ThemeToggle from './components/ThemeToggle.tsx';

export default function App() {

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <BrowserRouter>
            <ThemeToggle />
            <UserProvider>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/auth/login' element={<LoginPage />} />
                    <Route path='/auth/signup' element={<SignupPage />} />
                    <Route path='/skoly' element={<SchoolsPage />} />
                    <Route path='/skoly/:school' element={<SchoolDetailPage />} />
                    <Route path='/ucet' element={<AccountPage />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}