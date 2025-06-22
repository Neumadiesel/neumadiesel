'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function UploadInspectionPhoto() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [tempId, setTempId] = useState<string>(() => crypto.randomUUID());
    const [inspectionId, setInspectionId] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const uploadedById = user?.user_id || 1;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        if (selected) {
            setPreview(URL.createObjectURL(selected));
        }
    };

    const uploadPhoto = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tempId', tempId);
        formData.append('uploadedById', String(uploadedById));

        try {
            setUploading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/upload`, formData);
            console.log('Uploaded:', res.data);
            alert('Foto subida temporalmente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la foto');
        } finally {
            setUploading(false);
        }
    };

    const assignPhoto = async () => {
        if (!inspectionId || !tempId) return;

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/assign/${inspectionId}`, {
                tempId,
            });
            console.log('Asignado:', res.data);
            alert('Foto asociada a la inspección');
        } catch (err) {
            console.error(err);
            alert('Error al asignar la foto');
        }
    };

    const submitComment = async () => {
        if (!inspectionId || !comment.trim()) return;
        const userName = user?.name + ' ' + user?.last_name || 'Usuario Anónimo';

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-comments`, {
                inspectionId,
                userId: uploadedById,
                userName: userName,
                message: comment,   // ✅ este es el campo correcto
                isVisible,

            });
            console.log('Comentario guardado:', res.data);
            alert('Comentario enviado');
            setComment('');
        } catch (err: any) {
            console.error(err.response?.data || err);
            alert('Error al enviar comentario');
        }
    };

    return (
        <div className="p-4 space-y-4 border rounded shadow-md max-w-md mx-auto">
            <h2 className="text-lg font-bold">Subir Foto de Inspección</h2>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            {preview && (
                <div>
                    <p className="text-sm text-gray-500">Vista previa:</p>
                    <img src={preview} alt="Preview" className="w-48 border rounded" />
                </div>
            )}

            <button
                onClick={uploadPhoto}
                disabled={uploading || !file}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                Subir temporal
            </button>

            <div>
                <label>Asignar a inspección ID:</label>
                <input
                    type="number"
                    value={inspectionId ?? ''}
                    onChange={(e) => setInspectionId(Number(e.target.value))}
                    className="border px-2 py-1 ml-2"
                />
                <button
                    onClick={assignPhoto}
                    disabled={!inspectionId}
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                    Asignar
                </button>
            </div>

            <hr />

            <h3 className="text-lg font-bold">Agregar Comentario</h3>

            <textarea
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded"
            />

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                />
                ¿Visible para otros usuarios?
            </label>

            <button
                onClick={submitComment}
                disabled={!inspectionId || !comment.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded"
            >
                Enviar Comentario
            </button>
        </div>
    );
}