import ListaNeumaticos from "@/components/Listas/ListaNeumaticos";

export default function Page() {
    return (
        <div className="md:m-4 rounded-md p-3 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm font-mono">
            <ListaNeumaticos tipo={"operacion"} />
        </div>
    );
}