import { Label } from "@/components/ui/label";
import useOrder from "../hooks/useOrder";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "@/components/ui/button";
import OrdersClient from "@/api/services/OrdersClient";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import ComponentLoader from "@/components/common/component-loader";
import { InputAddon, InputGroup } from "@/components/ui/input";
import useInitOrder from "../hooks/useOrder";

export function Observations() {
    const { order, uuid, editPermissions } = useOrder();
    const orderClient = new OrdersClient();
    const [observations, setObservations] = useState<string>('');
    const [putObservations, setPutObservations] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {initOrder} = useInitOrder();

    async function handleSubmit() {
        if (!uuid) return;
        setLoading(true);
        try {
            const data = await orderClient.orderReservationUpdate(uuid, { observations: putObservations });
            if (data?.observations) {
                toast.success('La información se actualizo correctamente');
                initOrder();
                setPutObservations('');
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!order?.observations) return;
        setLoading(true);
        setObservations(order.observations);
        setLoading(false);
    }, [order]);

    return (
        <div className="col-12 p-5 row">
            {loading && <ComponentLoader />}
            <div className="col-12 fs-4 mt-3 fw-bold">
                Observaciones
            </div>

            <div className="separator my-2"></div>

            <div className="col-12">
                <Label className="fs-6 ">
                    Observaciones para pasajeros
                </Label>
                <div className="p-2" dangerouslySetInnerHTML={{ __html: observations }}></div>
            </div>

            <div className="separator my-2"></div>

            <div className={editPermissions ? "col-12" : "d-none"}>
                <Label>Observaciones <code>*</code></Label>
                <InputGroup >
                    <InputAddon>
                        <i className="fa fa-align-left" ></i>
                    </InputAddon>
                    <div className="form-control p-0 tw-bg-gray-200">
                        <CKEditor
                            editor={ClassicEditor as any}
                            data={putObservations}
                            config={{
                                toolbar: [
                                    'undo',
                                    'redo',
                                    '|',
                                    'heading',
                                    'bold',
                                    'italic',
                                    'underline',
                                    'strikethrough',
                                    'link',
                                    '|',
                                    'bulletedList',
                                    'numberedList',
                                ],
                                removePlugins: [
                                    'Image',
                                    'ImageToolbar',
                                    'ImageUpload',
                                    'ImageInsert',
                                    'MediaEmbed',
                                    'EasyImage',
                                    'CKFinder',
                                    'CKFinderUploadAdapter'
                                ]
                            }}
                            onChange={(event, editor) => {
                                setPutObservations(editor.getData());
                            }}
                        />
                    </div>
                </InputGroup>
            </div>

            <div className={editPermissions ? "mt-2 d-flex col-12 justify-content-end" : "d-none"}>
                <Button variant='success' onClick={handleSubmit}>
                    Actualizar observaciones
                </Button>
            </div>
        </div>
    )
}