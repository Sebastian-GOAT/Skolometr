import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import type { SchoolType } from './src/types/SchoolType';
import type { RatingType } from './src/types/RatingType';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export type GEMINIChatMessage = {
    role: 'model' | 'user';
    parts: { text: string }[];
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

class GEMINIChat {

    history: GEMINIChatMessage[];
    chat: any; // Chat session

    constructor(schools: SchoolType[], ratings: RatingType[]) {
        this.history = [
            {
                role: 'model',
                parts: [{ text: 'Dobrý den, jak vám mohu pomoci?' }],
            }
        ];
        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                {
                    role: 'model',
                    parts: [{ text: 'Dobrý den, jak vám mohu pomoci?' }],
                }
            ],
            config: {
                systemInstruction: 'Jsi Pepa, AI asistent na webu, kde mohou lidé hodnotit české školy (piš česky). Odpovídej výhradně prostým textem bez jakéhokoliv formátování, žádné hvězdičky, odrážky, tučný nebo kurzívový text, žádné číslování. Piš souvislý, čistý text. Pracuj s následujícími daty: ' + JSON.stringify(schools.map(school => {
                    return {
                        title: school.title,
                        adress: school.adress,
                        lat: school.lat,
                        lon: school.lon,
                        rating: school.rating
                    }
                })) + ' a ' + JSON.stringify(ratings),
            },
        });
    }

    async sendMessage(prompt: string): Promise<string> {
        const res = await this.chat.sendMessage({ message: prompt });
        return res.text;
    }

}

export {
    auth,
    db,
    GEMINIChat
};