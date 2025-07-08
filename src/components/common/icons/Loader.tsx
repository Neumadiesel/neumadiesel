// components/IconoCargador.tsx
import React from "react";

interface IconoCargadorProps {
	className?: string;
}

export default function IconoCargador({ className }: IconoCargadorProps) {
	return (
		<img
			src="/Loader.png"
			alt="Cargador Minero"
			className={className}
		/>
	);
}
