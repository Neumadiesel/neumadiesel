import ListaNeumaticos from "@/components/Listas/ListaNeumaticos";

export default function Page() {
    return (
        <div className=" p-4 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm font-mono">
            <ListaNeumaticos tipo={"operacion"} />
        </div>
    );
}