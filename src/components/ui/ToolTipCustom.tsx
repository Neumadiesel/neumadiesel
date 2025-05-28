import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export default function ToolTipCustom({
    children,
    content,
}: {
    children: ReactNode;
    content: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{content}</p> {/* Este es el texto del tooltip */}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
