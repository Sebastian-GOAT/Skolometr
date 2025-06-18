export type RequestOptionsType<T extends 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'> = {
    method: T;
    headers: Record<string, string>;
    body: string;
} & (T extends 'POST' | 'PATCH' | 'PUT' ? { body: string } : { body?: never });