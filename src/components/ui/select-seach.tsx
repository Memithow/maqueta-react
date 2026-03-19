import { useEffect, useRef, useState } from "react";
import { Command as CommandCmdk } from "cmdk";
import { Button, ButtonArrow } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

interface SelectSearchProps {
    keyword: string | undefined;
    onChangeKeyword: (keyword: string) => void;
    optionSelected: any;
    onChangeOption: (option: any) => void;
    options: any[];
    loading: boolean;
    setting: {
        value: string;
        label: string;
        key: string;
    };
    placeholder?: string;
    disabled?:boolean;
}

export function SelectSearch({
    keyword,
    onChangeKeyword,
    optionSelected,
    onChangeOption,
    options,
    setting,
    loading,
    placeholder = "Seleccione una opción...",
    disabled,
}: SelectSearchProps) {
    const [open, setOpen] = useState(false);
    const commandRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                commandRef.current &&
                !commandRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="input"
                    mode="input"
                    role="combobox"
                    aria-expanded={open}
                    className="form-control d-flex justify-content-between align-items-center tw-w-full"
                >
                    <span
                        className="text-truncate"
                        dangerouslySetInnerHTML={{
                            __html: optionSelected
                                ? optionSelected[setting.label].replace(
                                      "label label-info",
                                      "badge badge-light-success"
                                  )
                                : placeholder,
                        }}
                    ></span>
                    <ButtonArrow />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                side="bottom"
            >
                <div
                    ref={commandRef}
                    className="tw-w-full tw-overflow-y-auto"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            value={keyword}
                            onValueChange={(value) => {
                                onChangeKeyword(value);
                                onChangeOption(null);
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder="Buscar..."
                            className="form-control tw-rounded-none tw-border-b-0"
                        />

                        {open && (
                            <CommandList className="tw-mb-0">
                                {loading && (
                                    <CommandCmdk.Loading>
                                        <div className="d-flex align-items-center justify-content-center py-3 small text-muted">
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Buscando...
                                        </div>
                                    </CommandCmdk.Loading>
                                )}

                                {!loading &&
                                    options.length === 0 &&
                                    keyword && (
                                        <CommandEmpty className="py-3 text-center small text-muted">
                                            No se encontraron resultados
                                        </CommandEmpty>
                                    )}

                                {!loading && options.length &&
                                    options.map((option) => {
                                        const isSelected =
                                            optionSelected &&
                                            optionSelected[setting.key] ===
                                                option[setting.key];
                                        return (
                                            <CommandItem
                                                key={option[setting.key]}
                                                value={option[setting.value]}
                                                onSelect={() => {
                                                    setOpen(false);
                                                    onChangeOption(option);
                                                }}
                                                className={`tw-text-gray-700 tw-cursor-pointer tw-py-2 tw-px-3 ${
                                                    isSelected
                                                        ? "tw-bg-gray-200"
                                                        : ""
                                                } hover:tw-bg-gray-200 tw-flex tw-items-center tw-justify-between`}
                                            >
                                                <span
                                                    className="text-truncate"
                                                    dangerouslySetInnerHTML={{
                                                        __html: option[
                                                            setting.label
                                                        ].replace(
                                                            "label label-info",
                                                            "badge badge-light-success"
                                                        ),
                                                    }}
                                                ></span>
                                                {isSelected && (
                                                    <Check
                                                        className="tw-w-4 tw-h-4 tw-text-blue-700"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                            </CommandList>
                        )}
                    </Command>
                </div>
            </PopoverContent>
        </Popover>
    );
}
