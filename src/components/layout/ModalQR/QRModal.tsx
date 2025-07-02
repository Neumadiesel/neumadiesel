import Image from "next/image";

interface QRModalProps {
    onClose: () => void;
}

export default function QRModal({ onClose }: QRModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-xl"
                    aria-label="Cerrar"
                >
                    ✖️
                </button>
                <h2 className="text-lg font-bold mb-4 text-center text-black">Código QR</h2>
                <div className="flex justify-center">
                    <Image src="/QR.png" alt="QR" width={400} height={400} />
                </div>
            </div>
        </div>
    );
}