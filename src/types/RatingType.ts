import { type FieldValue } from 'firebase/firestore';

export type RatingType = {
    school: string;
    message: string;
    rating: number;
    email: string;
    photoURL: string | null;
    createdAt: FieldValue;
}