import axios from 'axios';

export async function uploadPhotoTemp(file: File, tempId: string, uploadedById: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tempId', tempId);
    formData.append('uploadedById', String(uploadedById));

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // puede incluir { url, id, etc. }
    } catch (error: any) {
        console.error('Error al subir foto temporal:', error.response?.data || error);
        throw error;
    }
}