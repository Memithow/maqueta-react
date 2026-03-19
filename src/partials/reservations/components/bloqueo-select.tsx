import { useEffect, useRef, useState } from "react";
import { SelectSearch } from "@/components/ui/select-seach";
import BloqueosClient from "@/api/services/BloqueosClient";
import { Label } from "@radix-ui/react-label";
import useOrder from "../hooks/useOrder.tsx";
import { toast } from "sonner"

interface Props {
    initLoader: (b: boolean) => void;
}

export default function BloqueoSelect({ initLoader }: Props) {
    const bloqueosClient = new BloqueosClient();
    const [keywordSearchBloqueo, setKeywordSearchBloqueo] = useState('');
    const [bloqueos, setBloqueos] = useState<BloqueoSearchInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { selectedBloqueo, setSelectedBloqueo, uuid } = useOrder()

    useEffect(() => {
        searchBloqueos(keywordSearchBloqueo);
    }, [keywordSearchBloqueo]);

    async function searchBloqueos(keyword: string) {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort(); // cancelar petición anterior
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setLoading(true);
            const bloqueos_res = await bloqueosClient.searchBloqueos(keyword, controller.signal);

            if (bloqueos_res) {
                setBloqueos(bloqueos_res)
            }
        } catch (e) {
            toast.error('¡Falla al consultar la informacion del bloqueo!');
            console.error(e);
        } finally {
            setLoading(false);
            initLoader(false);
        }
    }


    return (
        <>
            <Label className="mb-2">
                Salida <code>*</code>
            </Label>
            <SelectSearch
                disabled={uuid ? true : false}
                keyword={keywordSearchBloqueo}
                onChangeKeyword={(keyword) =>
                    setKeywordSearchBloqueo(keyword)
                }
                optionSelected={selectedBloqueo}
                onChangeOption={(bloqueo) => setSelectedBloqueo(bloqueo)}
                options={bloqueos}
                setting={{
                    value: 'id',
                    label: 'text',
                    key: 'id',
                }}
                loading={loading}
                placeholder="Selecciona una salida"
            />
        </>
    )
}
