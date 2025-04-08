

import ListaNeumaticos from "@/components/Listas/ListaNeumaticos";


export default function Page() {

    return (
        <div className="bg-white dark:bg-[#212121] lg:m-4 p-3 rounded-md shadow-lg h-[100%] pb-4 font-mono">

            <div>
                <ListaNeumaticos tipo={'Bodega'} />
            </div>
        </div>
    )
}