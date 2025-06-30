"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis } from "recharts";

interface Tire {
    code: string;
    model: {
        dimensions: string;
        brand?: string;
    };
    lastInspection: {
        pressure: number | null;
        temperature: number | null;
        internalTread: number;
        externalTread: number;
        inspectionDate: string;
        inspectorName?: string;
        kilometrage: number;
        findings?: string;
        recommendations?: string;
        approved?: boolean;
    };
    installedTires: {
        vehicle: {
            model: string;
        };
        position: number;
    }[];
    installationDate?: string;
    totalKilometers?: number;
    totalHours?: number;
    retirementDate?: string;
    retirementReason?: string;
    daysInService?: number;
}

interface TireEvent {
    id: number;
    date: string;
    type: "Inspection" | "Movement" | "Intervention" | "Installation" | "Retirement";
    description: string;
    performedBy?: string;
    pressure?: number;
    treadDepth?: number;
    kilometrage?: number;
    findings?: string;
    recommendations?: string;
    status?: "Approved" | "Rejected" | "Pending";
    images?: TireImage[];
}

interface TireImage {
    id: number;
    url: string;
    title: string;
    date: string;
    eventType: string;
    description: string;
}

export default function TireHealthDashboard() {
    const [tires, setTires] = useState<Tire[]>([]);
    const [selectedTire, setSelectedTire] = useState<Tire | null>(null);
    const [events, setEvents] = useState<TireEvent[]>([]);
    const [images, setImages] = useState<TireImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<TireImage | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Helper functions
    const getEventBadgeColor = (type: string) => {
        switch (type) {
            case "Inspection":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Movement":
                return "bg-green-100 text-green-800 border-green-200";
            case "Intervention":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Installation":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "Retirement":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case "Inspection":
                return "🔍";
            case "Movement":
                return "🚚";
            case "Intervention":
                return "🔧";
            case "Installation":
                return "🔄";
            case "Retirement":
                return "🚫";
            default:
                return "📋";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    useEffect(() => {
        const loadMockData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simular carga de datos
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock tire data
                const mockTire: Tire = {
                    code: "A3M000091",
                    model: {
                        dimensions: "27.00R49",
                        brand: "Michelin"
                    },
                    lastInspection: {
                        pressure: 142,
                        temperature: 68,
                        internalTread: 22,
                        externalTread: 24,
                        inspectionDate: "2024-06-15",
                        inspectorName: "Miguel Torres",
                        kilometrage: 125000,
                        findings: "Desgaste límite alcanzado en banda de rodadura",
                        recommendations: "Programar reemplazo inmediato",
                        approved: false
                    },
                    installedTires: [{
                        vehicle: { model: "Caterpillar 797F" },
                        position: 3
                    }],
                    installationDate: "2023-01-10",
                    totalKilometers: 125000,
                    totalHours: 8500,
                    retirementDate: "2024-06-15",
                    retirementReason: "Desgaste excesivo en banda de rodadura",
                    daysInService: 521
                };

                // Mock events data
                const mockEvents: TireEvent[] = [
                    {
                        id: 7,
                        date: "2024-06-15",
                        type: "Retirement",
                        description: "Neumático retirado por desgaste límite",
                        performedBy: "Supervisor Miguel Torres",
                        status: "Approved"
                    },
                    {
                        id: 6,
                        date: "2024-06-15",
                        type: "Inspection",
                        description: "Inspección final - Desgaste límite detectado",
                        performedBy: "Miguel Torres",
                        pressure: 142,
                        treadDepth: 22,
                        kilometrage: 125000,
                        findings: "Desgaste límite alcanzado en banda de rodadura",
                        recommendations: "Programar reemplazo inmediato",
                        status: "Approved"
                    },
                    {
                        id: 5,
                        date: "2024-04-20",
                        type: "Movement",
                        description: "Cambio de vehículo - De camión C-150 a C-320",
                        performedBy: "Técnico Luis Rodríguez"
                    },
                    {
                        id: 4,
                        date: "2024-01-08",
                        type: "Inspection",
                        description: "Inspección semestral de rutina",
                        performedBy: "Juan Pérez",
                        pressure: 145,
                        treadDepth: 35,
                        kilometrage: 89000,
                        findings: "Estado general bueno, desgaste uniforme dentro de parámetros",
                        recommendations: "Continuar operación normal",
                        status: "Approved"
                    },
                    {
                        id: 3,
                        date: "2023-09-12",
                        type: "Intervention",
                        description: "Reparación de pinchazo menor en banda lateral",
                        performedBy: "Técnico Pedro Martínez",
                        pressure: 148,
                        treadDepth: 48,
                        kilometrage: 65000,
                        findings: "Pinchazo de 5mm reparado exitosamente",
                        recommendations: "Monitorear presión durante próximas 72 horas",
                        status: "Approved"
                    },
                    {
                        id: 2,
                        date: "2023-06-20",
                        type: "Inspection",
                        description: "Inspección trimestral",
                        performedBy: "Ana García",
                        pressure: 150,
                        treadDepth: 62,
                        kilometrage: 42000,
                        findings: "Estado excelente, sin anomalías detectadas",
                        recommendations: "Continuar operación normal",
                        status: "Approved"
                    },
                    {
                        id: 1,
                        date: "2023-01-10",
                        type: "Installation",
                        description: "Instalación inicial en posición trasera izquierda exterior",
                        performedBy: "Técnico Carlos López",
                        pressure: 150,
                        treadDepth: 100,
                        kilometrage: 0,
                        findings: "Neumático nuevo instalado correctamente",
                        recommendations: "Verificar presión en 24 horas",
                        status: "Approved"
                    }
                ];

                // Mock images data
                const mockImages: TireImage[] = [
                    {
                        id: 1,
                        url: "/api/placeholder/600/400",
                        title: "Instalación",
                        date: "2023-01-10",
                        eventType: "Installation",
                        description: "Neumático nuevo instalado"
                    },
                    {
                        id: 2,
                        url: "/api/placeholder/600/400",
                        title: "Inspección 6 meses",
                        date: "2023-06-20",
                        eventType: "Inspection",
                        description: "Estado excelente"
                    },
                    {
                        id: 3,
                        url: "/api/placeholder/600/400",
                        title: "Reparación pinchazo",
                        date: "2023-09-12",
                        eventType: "Intervention",
                        description: "Reparación exitosa"
                    },
                    {
                        id: 4,
                        url: "/api/placeholder/600/400",
                        title: "Inspección anual",
                        date: "2024-01-08",
                        eventType: "Inspection",
                        description: "Desgaste normal"
                    },
                    {
                        id: 5,
                        url: "/api/placeholder/600/400",
                        title: "Estado final",
                        date: "2024-06-15",
                        eventType: "Retirement",
                        description: "Desgaste límite"
                    }
                ];

                setSelectedTire(mockTire);
                setEvents(mockEvents);
                setImages(mockImages);
                setSelectedImage(mockImages[0]);

            } catch (err) {
                setError("Error al cargar los datos del neumático");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-8 bg-gray-200 mb-2 w-1/3 rounded"></div>
                                <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                            </div>
                            <div className="w-24 h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Cards skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                                </div>
                                <div className="h-8 bg-gray-200 mb-2 w-1/2 rounded"></div>
                                <div className="h-3 bg-gray-200 w-1/3 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar datos</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedTire) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">🛞</div>
                        <h2 className="text-xl font-semibold text-gray-600">Sin datos del neumático</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* 🟢 1. Encabezado Principal */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl">🛞</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Neumático {selectedTire.code}
                                </h1>
                                <div className="flex flex-wrap gap-6 text-gray-600">
                                    <span><strong>Marca:</strong> {selectedTire.model.brand || 'Michelin'}</span>
                                    <span><strong>Modelo:</strong> XHA2</span>
                                    <span><strong>Dimensión:</strong> {selectedTire.model.dimensions}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200 mb-2">
                                <span className="mr-2">🚫</span>
                                Dado de Baja
                            </div>
                            <p className="text-sm text-gray-500">
                                {selectedTire.retirementDate && formatDate(selectedTire.retirementDate)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🟢 2. Fichas Técnicas con 4 Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Profundidad Inicial */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">📏</span>
                            <span className="text-sm font-medium text-gray-600">Profundidad Inicial</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">100</div>
                        <div className="text-sm text-gray-500">milímetros</div>
                    </div>

                    {/* Profundidad Final */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">📐</span>
                            <span className="text-sm font-medium text-gray-600">Profundidad Final</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600 mb-1">{selectedTire.lastInspection.internalTread}</div>
                        <div className="text-sm text-gray-500">milímetros</div>
                    </div>

                    {/* Kilómetros Totales */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🛣️</span>
                            <span className="text-sm font-medium text-gray-600">Kilómetros Totales</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {selectedTire.totalKilometers?.toLocaleString() || '125.000'}
                        </div>
                        <div className="text-sm text-gray-500">kilómetros</div>
                    </div>

                    {/* Horas de Uso */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">⏱️</span>
                            <span className="text-sm font-medium text-gray-600">Horas de Uso</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {selectedTire.totalHours?.toLocaleString() || '8.500'}
                        </div>
                        <div className="text-sm text-gray-500">horas</div>
                    </div>
                </div>

                {/* 🟢 3. Especificaciones y Vida Útil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Especificaciones */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Especificaciones</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-500">Marca / Modelo</span>
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedTire.model.brand || 'Goodyear'} RL-4K
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Medida</span>
                                <p className="text-lg font-bold text-gray-900">{selectedTire.model.dimensions}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vida Útil */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vida Útil</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-500">Días en Servicio</span>
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedTire.daysInService || '679'} días
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Kilometraje Total</span>
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedTire.totalKilometers?.toLocaleString() || '25.800'} km
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🟢 4. Historial Cronológico de Eventos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        Historial Cronológico de Eventos
                    </h2>

                    <div className="space-y-6">
                        {events.map((event, index) => (
                            <div key={event.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-start gap-4">
                                    {/* Ícono del evento */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl border-2 border-gray-200 shadow-sm">
                                            {getEventIcon(event.type)}
                                        </div>
                                    </div>

                                    {/* Contenido principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEventBadgeColor(event.type)}`}>
                                                    {event.type === 'Inspection' ? 'Inspección' :
                                                        event.type === 'Movement' ? 'Movimiento' :
                                                            event.type === 'Intervention' ? 'Intervención' :
                                                                event.type === 'Installation' ? 'Instalación' : 'Retiro'}
                                                </span>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {formatDate(event.date)}
                                                </span>
                                            </div>
                                            {event.status && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                                                    {event.status === 'Approved' ? 'Aprobado' :
                                                        event.status === 'Rejected' ? 'Rechazado' : 'Pendiente'}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-700 mb-3 font-medium">{event.description}</p>

                                        {event.performedBy && (
                                            <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                                                <span>👤</span>
                                                <strong>Responsable:</strong> {event.performedBy}
                                            </p>
                                        )}

                                        {/* Información detallada para inspecciones */}
                                        {(event.type === 'Inspection' || event.type === 'Intervention') && (
                                            <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    {event.pressure && (
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-600">Presión</span>
                                                            <p className="text-lg font-bold text-blue-600">{event.pressure} PSI</p>
                                                        </div>
                                                    )}
                                                    {event.treadDepth && (
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-600">Profundidad</span>
                                                            <p className="text-lg font-bold text-green-600">{event.treadDepth} mm</p>
                                                        </div>
                                                    )}
                                                    {event.kilometrage && (
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-600">Kilometraje</span>
                                                            <p className="text-lg font-bold text-purple-600">{event.kilometrage.toLocaleString()} km</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {event.findings && (
                                                    <div className="mb-3">
                                                        <span className="text-sm font-medium text-gray-600">Hallazgos:</span>
                                                        <p className="text-gray-800 mt-1">{event.findings}</p>
                                                    </div>
                                                )}

                                                {event.recommendations && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-600">Recomendaciones:</span>
                                                        <p className="text-gray-800 mt-1">{event.recommendations}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟢 5. Estado Final de Baja */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🚫</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-red-800 mb-4">Retiro</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-sm font-medium text-red-700">Fecha de retiro:</span>
                                    <p className="text-xl font-bold text-red-900 mt-1">
                                        {selectedTire.retirementDate && formatDate(selectedTire.retirementDate)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-red-700">Razón del retiro:</span>
                                    <p className="text-xl font-bold text-red-900 mt-1">
                                        {selectedTire.retirementReason || "Desgaste excesivo en flancos"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🟢 6. Historial Fotográfico */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-2xl">📸</span>
                        Historial Fotográfico
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel Principal de Imagen */}
                        <div className="lg:col-span-2">
                            {selectedImage && (
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                        <span className="text-gray-400 text-4xl">🖼️</span>
                                        {/* Aquí iría la imagen real */}
                                        {/* <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-cover rounded-lg" /> */}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{selectedImage.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{formatDate(selectedImage.date)}</p>
                                        <p className="text-gray-700">{selectedImage.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Historial Lateral de Miniaturas */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800">Miniaturas</h4>
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    onClick={() => setSelectedImage(image)}
                                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedImage?.id === image.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-gray-400 text-sm">🖼️</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">{image.title}</p>
                                        <p className="text-xs text-gray-500">{formatDate(image.date)}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mt-1 ${getEventBadgeColor(image.eventType)}`}>
                                            {image.eventType === 'Inspection' ? 'Inspección' :
                                                image.eventType === 'Movement' ? 'Movimiento' :
                                                    image.eventType === 'Intervention' ? 'Intervención' :
                                                        image.eventType === 'Installation' ? 'Instalación' : 'Retiro'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🟢 7. Botones de Acción */}
                <div className="flex justify-center gap-4 pb-8">
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium">
                        <span>🖨️</span>
                        Imprimir Reporte
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
                        <span>📄</span>
                        Exportar PDF
                    </button>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium">
                        <span>↩️</span>
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
