'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function TirePhotoGallery() {
    const [tireId, setTireId] = useState('');
    const [photos, setPhotos] = useState<{ id: number; url: string; createdAt: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchPhotos = async () => {
        if (!tireId) return;
        setLoading(true);
        try {
            const res = await fetch(`https://inventory.neumasystem.site/tires/photos/${tireId}`);
            const data = await res.json();
            setPhotos(data);
        } catch {
            alert('Error al obtener fotos.');
            // ...

        } finally {
            setLoading(false);
        }
    };
    const handleUpload = async () => {
        if (!files || !tireId) return;

        const formData = new FormData();

        // ✅ convertir correctamente FileList en array
        Array.from(files).forEach((file) => {
            formData.append('photos', file); // el campo debe llamarse 'photos' como en el backend
        });

        formData.append('tireId', tireId.toString());

        console.log('Archivos seleccionados:', files);
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        setUploading(true);
        try {
            const res = await fetch('https://inventory.neumasystem.site/tires/upload-photos', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Error al subir fotos');

            alert('Fotos subidas correctamente');
            setFiles(null);
            fetchPhotos();
        } catch {
            alert('Error al obtener fotos.');
            // ...

        } finally {
            setUploading(false);
        }
    };
    return (
        <div className="p-4 max-w-3xl mx-auto bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Galería de Fotos del Neumático</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    value={tireId}
                    onChange={(e) => setTireId(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="ID del neumático"
                />
                <button
                    onClick={fetchPhotos}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    disabled={loading || !tireId}
                >
                    {loading ? 'Cargando...' : 'Ver Fotos'}
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="mb-2"
                />
                <button
                    onClick={handleUpload}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={uploading || !files || !tireId}
                >
                    {uploading ? 'Subiendo...' : 'Subir Fotos'}
                </button>
            </div>

            {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="border rounded overflow-hidden">
                            <Image
                                src={`https://inventory.neumasystem.site${photo.url}`}
                                alt="logo"
                                width={660}
                                height={460}
                                className=""
                            />
                            <div className="text-xs text-center p-1 bg-gray-100 dark:bg-gray-800">
                                {new Date(photo.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p className="text-gray-500">No hay fotos disponibles.</p>
            )}
        </div>
    );
}