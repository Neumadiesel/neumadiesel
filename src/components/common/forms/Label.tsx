export default function Label({ title, isNotEmpty }: { title: string, isNotEmpty: boolean }) {
    return (
        <label className="text-sm mt-2 font-semibold mb-2">{title}
            {
                isNotEmpty && <span className="text-red-400">*</span>
            }
        </label>
    )
}