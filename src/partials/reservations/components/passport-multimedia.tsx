import { useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { Masonry } from 'masonic';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'
import ComponentLoader from '@/components/common/component-loader';
import OrdersClient from '@/api/services/OrdersClient';
import useOrder from '../hooks/useOrder';

interface OptionalMultimediaResourceInterface {
    mimetype: string;
    name: string;
    public: string;
    storage: string;
}

interface OptionalMultimediaInterface {
    resource: OptionalMultimediaResourceInterface;
    uuid: string;
}

interface Props {
    onUploadComplete?: (results: any[]) => void;
    media: string;
    puid: string;
}

interface UploadStatus {
    file: File;
    preview: string;
    status: 'pending' | 'success' | 'error';
}

export function OptionalMultimedia({ media, onUploadComplete, puid }: Props) {
    const { uuid } = useOrder();
    const [multimedia, setMultimedia] =
        useState<OptionalMultimediaInterface[]>([]);
    const [images, setImages] = useState<UploadStatus[]>([]);
    const [isLoadingMultimedia, setIsLoadingMultimedia] = useState(false);
    const hasImage = multimedia.length > 0 || images.length > 0;
    const ordersClient = new OrdersClient();

    const deleteMedia = async (media_uuid: string) => {
        if (uuid) {
            try {
                setIsLoadingMultimedia(true);
                const resp_delete = {};

                if (resp_delete) {
                    toast.success('Imagen eliminada.');
                    getMultimedia();
                }

                setIsLoadingMultimedia(false);
            } catch (e: any) {
                setIsLoadingMultimedia(false);
                toast.error(e.message);
            }
        }
    };

    const getMultimedia = async () => {
        if (uuid) {
            setIsLoadingMultimedia(true);

            const multimedia_resp = await ordersClient.orderReservationPsgPassport(uuid, puid);

            setMultimedia(
                Array.isArray(multimedia_resp) ? multimedia_resp : [],
            );

            setIsLoadingMultimedia(false);
        }
    };

    const uploadFile = async (img: UploadStatus) => {
        const formData = new FormData();
        formData.append('passport', img.file);

        try {
            if (uuid) {
                const res = await ordersClient.saveMultimedia(uuid, puid, formData);

                if (!res) throw new Error('Upload failed');

                onUploadComplete?.([res]);
                getMultimedia();

                // Limpia solo las que se subieron bien
                setTimeout(() => {
                    setImages((prev) =>
                        prev.filter(
                            (img: UploadStatus) => img.status !== 'success',
                        ),
                    );
                }, 2000);

                return { ...img, status: 'success' };
            }
        } catch (e) {
            toast.error(`Error al subir ${img.file.name}`);
            return { ...img, status: 'error' };
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages: UploadStatus[] = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            status: 'pending',
        }));

        setImages(newImages);

        // Subida automática
        newImages.forEach(async (img) => {
            const updated = await uploadFile(img);
            setImages((prev) =>
                prev.map((i) => (i.preview === img.preview ? updated : i)),
            );
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    return (
        <div className="space-y-4">
            <div
                {...(!hasImage ? getRootProps() : {})}
                className={`cursor-pointer rounded border-3 border-dashed p-6 transition`}
            >
                {!hasImage && <input {...getInputProps()} />}

                {!hasImage && (
                    <p className="text-center text-sm text-gray-600">
                        {isDragActive
                            ? 'Suelta la imagen aquí...'
                            : 'Arrastra o haz clic para subir la imagen'}
                    </p>
                )}

                {hasImage && (
                    <p className="text-center text-sm text-gray-500">
                        Solo se permite una imagen
                    </p>
                )}

                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {images.map((img, index) => (
                            <div key={index} className="tw-relative">
                                <img
                                    src={img.preview}
                                    alt={`preview-${index}`}
                                    className={`max-h-40 rounded border-2 object-cover shadow ${img.status === 'success'
                                        ? 'border-green-500'
                                        : img.status === 'error'
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                />
                                {img.status === 'success' && (
                                    <span className="absolute right-1 bottom-1 rounded bg-green-600 px-2 py-1 text-xs text-white">
                                        Cargado
                                    </span>
                                )}
                                {img.status === 'error' && (
                                    <span className="absolute right-1 bottom-1 rounded bg-red-600 px-2 py-1 text-xs text-white">
                                        Error
                                    </span>
                                )}
                                {img.status === 'pending' && (
                                    <ComponentLoader/>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full">
                {isLoadingMultimedia && <ComponentLoader key="multimedias" />}
                <Masonry
                    key={multimedia.length}
                    items={multimedia}
                    render={({ data }) => (
                        <div className="relative m-2">
                            <div className="absolute z-0 h-full w-full content-center text-center opacity-0 hover:bg-black/30 hover:opacity-100">
                                <Button
                                    variant="outline"
                                    className="border-primary/80 text-primary h-[50px] w-[50px] rounded-full border-4 bg-transparent p-2 hover:text-white"
                                    onClick={() => deleteMedia(data.uuid)}
                                >
                                    <X
                                        strokeWidth={5}
                                        className="size-[30px]"
                                    />
                                </Button>
                            </div>
                            <img
                                src={data.resource?.public ?? ''}
                                key={data.uuid}
                                className="w-full rounded shadow"
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
