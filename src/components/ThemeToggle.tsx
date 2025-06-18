import { useState } from 'react';

export default function ThemeToggle() {

    const [isDarkmode, toggleDarkmode] = useState<boolean>(true);

    function handleClick() {
        toggleDarkmode(mode => !mode);
        document.documentElement.classList.toggle('dark');
    }

    return (
        <div
            onClick={handleClick}
            className='aspect-square w-12 fixed bottom-4 left-4 z-50 text-[1.25rem] bg-[var(--bg-theme-toggle)] rounded-xl flex justify-center items-center cursor-pointer'
        >
            <span className={`${isDarkmode ? 'rotate-360' : 'rotate-0'} transition-transform duration-700`}>
                {
                    isDarkmode ? '🌙' : '☀️'
                }
            </span>
        </div>
    );
}