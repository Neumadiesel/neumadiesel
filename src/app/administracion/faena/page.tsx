export default function Page() {
    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md shadow-lg h-[100%] pb-4">
            <section className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Contratos de faena</h1>
                <button className="bg-amber-300 hover:bg-amber-400 flex px-4 justify-center text-black p-2 rounded-md items-center gap-2 text-md font-semibold">
                    <span>Nuevo contrato</span>
                </button>
            </section>
            <main></main>
        </div>
    );
}
