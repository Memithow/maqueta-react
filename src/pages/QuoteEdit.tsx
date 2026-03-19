import { useEffect, useRef, useState } from "react";
import BloqueoSelect from "@/partials/reservations/components/bloqueo-select";
import OrdersClient from "@/api/services/OrdersClient";
import { Label } from "@/components/ui/label.tsx";
import { TextArea } from "@/components/ui/input.tsx";
import ClientInfo from "@/partials/reservations/components/client-info";
import TableTours from "@/partials/reservations/components/table-tours";
import OptionalsModal from "@/partials/reservations/components/optionals-modal";
import { Button } from "@/components/ui/button.tsx";
import RoomSelector from "@/partials/reservations/components/rooms";

import ComponentLoader from "@/components/common/component-loader"
import useGetOrder from "@/partials/reservations/hooks/useGetOrder";
import useInitOrder from "@/partials/reservations/providers/useOrder.tsx";
import mapOrder from "@/partials/reservations/helpers/mapOrder";
import useOrder from "@/partials/reservations/hooks/useOrder.tsx";
import sendQuote from "@/partials/reservations/helpers/sendQuote";
import { toast } from 'sonner';

export default function QuoteEdit() {
  const ordersClient = new OrdersClient();

  const [loading, setLoading] = useState(false);
  const [openModalOptionals, setOpenModalOptionals] =
    useState<boolean>(false);
  const addRomFunctionRef = useRef<{ addRoom: () => void }>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  const { bloqueoRules } = useGetOrder();
  const { initOrder } = useInitOrder();
  const { submit } = sendQuote();
  const { paxRooms } = mapOrder();
  const {
    description,
    setDescription,
    selectTours,
    setSelectTours,
    psgPax,
    setPsgPax,
    rulesBloqueo,
    setCountRooms,
    roomsInformation,
    setRoomsInformation,
    selectedBloqueo,
    uuid,
    order,
    customer,
    agent,
  } = useOrder();

  useEffect(() => {
    setPsgPax(paxRooms(roomsInformation));;
  }, [roomsInformation]);

  useEffect(() => {
    if (uuid) return;
    setLoading(true);
    bloqueoRules();

    setSelectTours([]);
    setCountRooms(0);
    setRoomsInformation([]);
    setLoading(false);
  }, [selectedBloqueo]);

  useEffect(() => {
    initOrder()
  }, []);

  async function handleSubmit() {
    setLoadingOrder(true);
    const resp = await submit();
    setLoadingOrder(resp);
  }

  function modalOpen() {
    if (Number(psgPax?.adt) === 0 || !psgPax?.adt) {
      toast.error("¡Selecciona una habitación!");
      return;
    }

    if (rulesBloqueo?.bloqueo?.mts?.tours?.length === 0) {
      toast.error("¡No hay opcionales disponibles!");
      return;
    }

    setOpenModalOptionals(true);
  }

  return (
    <div className="col-12 pb-5 ">
      <div className="tw-text-lg tw-mb-3">
        Información de la cotización
      </div>

      {(loadingOrder || (uuid && (
          !order || !selectedBloqueo || !rulesBloqueo || !roomsInformation
        ))) &&
        <ComponentLoader />
      }

      <div className="row">
        <div className="col-6">
          <BloqueoSelect
            initLoader={setLoadingOrder}
          />
        </div>

        <div className="col-12 mt-5">
          <ClientInfo />
        </div>

        <div className="col-12 mt-5">
          <Label>Observaciones Internas</Label>
          <code>*</code>
          <div className="mt-2">
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"Observaciones internas"}
              rows={3}
            />
          </div>
        </div>

        <div className="separator my-5" />
        <div className="col-12 mt-5 div-card-room tw-relative tw-min-h-max">
          {loading && (
            ComponentLoader()
          )}
          {selectedBloqueo && !loading ? (
            <RoomSelector
              ref={addRomFunctionRef}
            />
          ) : (
            <div className="alert alert-warning fw-bold">
              Seleccione un Bloqueo para administrar las habitaciones
            </div>
          )}
        </div>

        <div className="col-12 ">
          {roomsInformation.length > 0 && selectTours.length > 0 && rulesBloqueo && (
            <div className="row mt-4 table table-responsive-md p-2">
              <TableTours />
            </div>
          )}
        </div>
        <div className="col-12 ">
          {
            rulesBloqueo &&
            <OptionalsModal
              open={openModalOptionals}
              onOpenChange={() => setOpenModalOptionals(false)}
              title="Tours Opcionales"
            />
          }
        </div>
        <div className="col-12 ">
          {rulesBloqueo && (
            <div className="row">
              <div className="col-md-12 d-flex justify-content-center align-items-center">
                <Button
                  onClick={() =>
                    addRomFunctionRef.current?.addRoom()
                  }
                  className="btn-light-success me-3"
                >
                  + Agregar habitación
                </Button>
                <Button
                  className="btn-light-primary"
                  onClick={modalOpen}
                >
                  Tours Opcionales
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 d-flex justify-content-end">
          <Button onClick={handleSubmit} disabled={(selectedBloqueo && roomsInformation && ordersClient && (customer && agent)) ? false : true}>Generar cotización</Button>
        </div>
      </div>
    </div>
  );
}
