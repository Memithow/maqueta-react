
const ComponentLoader = () => {
    return (
        <div className="tw-bg-body tw-opacity-[.70] tw-absolute tw-inset-0 tw-z-50 tw-flex tw-h-full tw-w-full tw-min-h-[60px] tw-content-center tw-items-center tw-justify-center tw-backdrop-blur-xs">
            <div className="tw-h-[70px] tw-w-[70px] tw-self-center my-5">
                <img
                    className="tw-w-full tw-max-w-none"
                    src={'/media/loading.gif'}
                    alt="logo"
                />
                <div className="tw-text-muted-foreground tw-text-sm tw-font-medium">
                    Cargando...
                </div>
            </div>
        </div>
    );
};

export default ComponentLoader;
