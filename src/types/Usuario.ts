export interface Usuario {
    nombre: string;
    correo: string;
    rol: "administrador" | "planificador" | "supervisor" | "operador";
    faena: string;
}
