export default function LabelLoading({ loading, title, text }: { loading: boolean, title: string, text: string }) {
    return (
        <p>
            <span className="text-sm font-semibold">{title}</span>  {loading ? "Cargando..." : text}
        </p>
    )
}