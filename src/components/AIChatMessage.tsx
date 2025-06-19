type Props = {
    role: 'user' | 'model';
    message: string;
}

export default function AIChatMessage({ role, message }: Props) {

    return (
        <div className={`px-6 py-2 w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 max-w-4/5 h-fit ${role === 'user' ? 'bg-[var(--main)]' : 'bg-blue-950'} text-white rounded-2xl`}>
                {message}
            </div>
        </div>
    );
}