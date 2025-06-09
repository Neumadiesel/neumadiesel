"use client";
import Faena from "@/components/faena/FaenaPage";
import { useParams } from "next/navigation"
export default function Page() {
    const params = useParams<{ id: string }>();
    const id = params.id
    return (
        <Faena id={id} />
    );
}
