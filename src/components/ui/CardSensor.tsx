

export default function CardSensor({ posicion, sensor, psi, temp }: { posicion: number, sensor: number, psi: number, temp: number }) {
    return (
        <div className=" bg-slate-200 text-black font-bold rounded-md flex flex-col items-start px-3">
            <p>Posicion: {posicion}</p>
            <p><small>Sensor:</small> {sensor}</p>
            <p>PSI: {psi}</p>

            <p>Temp °C: {temp}</p>
        </div>
    )
}