// components/selects/VehicleSelect.tsx
"use client";

import Select from "react-select";

interface Option {
    value: string;
    label: string;
}

interface VehicleSelectProps {
    vehicles: { code: string }[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function VehicleSelect({
    vehicles,
    value,
    onChange,
    className = "",
}: VehicleSelectProps) {
    const options: Option[] = vehicles.map((v) => ({
        value: v.code,
        label: v.code,
    }));

    const selected = value ? options.find((o) => o.value === value) : null;

    return (
        <Select
            name="vehicleCode"
            options={options}
            value={selected}
            onChange={(option) => onChange(option?.value || "")}
            placeholder="Selecciona un Vehículo"
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: "#313131",
                    borderColor: state.isFocused ? "#3B82F6" : "#4B5563",
                    boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(59,130,246,0.3)"
                        : "none",
                    "&:hover": {
                        borderColor: "#3B82F6",
                    },
                    borderRadius: 6,
                    padding: "2px 4px",
                    minHeight: "42px",
                    color: "white",
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "white",
                }),
                singleValue: (base) => ({
                    ...base,
                    color: "white",
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "#313131",
                    color: "white",
                    zIndex: 20,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                        ? "#4B5563"
                        : "#313131",
                    color: "white",
                    "&:active": {
                        backgroundColor: "#1F2937",
                    },
                }),
            }}
            className={`text-sm ${className}`}
        />
    );
}