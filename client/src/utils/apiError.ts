import axios from 'axios';

interface ApiErrorResponse {
    detail?: string;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.detail || error.message || fallback;
    }

    return error instanceof Error ? error.message : fallback;
};
