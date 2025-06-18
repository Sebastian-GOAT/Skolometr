import { useNavigate } from 'react-router-dom';

export default function HeroButton({ title }: { title: string; }) {

    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/skoly')}
            className={`
                relative z-10 px-6 py-2 rounded-full font-medium
                bg-[var(--main)] text-white
                hover:bg-transparent hover:text-[var(--accent)]
                cursor-pointer transition-colors duration-200

                after:content-[''] after:absolute after:inset-0
                after:rounded-full after:bg-[var(--accent)]
                after:blur-md after:opacity-30
            `}
        >
            {title}
        </button>
    );
}