import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export default function ToolTipTire({
    children,
    content,
}: {
    children: ReactNode;
    content: ReactNode; // <- CAMBIO AQUÍ
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
