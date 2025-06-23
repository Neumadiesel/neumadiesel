'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Asegúrate de tener una función `cn` para combinar clases

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, ...props }, ref) => {
        const percentage = Math.min((value / max) * 100, 100);

        return (
            <div
                ref={ref}
                className={cn('w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', className)}
                {...props}
            >
                <div
                    className="h-full bg-amber-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    }
);

Progress.displayName = 'Progress';