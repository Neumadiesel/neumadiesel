"use client";
import { useParams } from "next/navigation";
import OT from "@/components/features/ordendetrabajo/Ot";
export default function OTPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    return <OT id={id} />;
}
