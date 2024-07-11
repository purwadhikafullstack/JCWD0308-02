import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormSchema, useAddressForm } from "./validation";
import { z } from "zod";
import { useCreateUserAddress, useUpdateUserAddress } from "./mutation";
import FieldLabelAddress from "./field/label-address";
import FieldRecipient from "./field/recipient";
import FieldProvince from "./field/province";
import FieldCity from "./field/city";
import FieldAddress from "./field/address";
import FieldCoordinate from "./field/coordinate";
import FieldLatitude from "./field/latitude";
import FieldLongitude from "./field/longitude";
import { useState } from "react";
import { FieldNote } from "./field/note";
import FieldCheckBox from "./field/main-checkbox";
import FieldPhone from "./field/phone";
import { Address } from "@/lib/types/address";

export default function CreateAddressForm({
  handleClose,
  type,
  address,
  setActiveTab,
  setAddressId,
}: {
  handleClose: () => void;
  type: "create" | "update";
  address?: Address;
  setAddressId: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const form = useAddressForm({
    address: address?.address || "",
    coordinate: address?.coordinate || "",
    cityId: address?.cityId?.toString() || "",
    provinceId: address?.city?.provinceId?.toString() || "",
    isMainAddress: address?.isMainAddress || false,
    labelAddress: address?.labelAddress || "",
    latitude: address?.latitude || "",
    longitude: address?.longitude || "",
    recipientName: address?.recipientName || "",
    note: address?.note || "",
    phone: address?.phone || "",
  });

  const createUserAddress = useCreateUserAddress(handleClose);
  const updateUserAddress = useUpdateUserAddress(handleClose, address?.id!);

  const [provinceId, setProvinceId] = useState(address?.city?.provinceId || 0);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (type === "create") {
      await createUserAddress.mutateAsync(data);
    } else {
      await updateUserAddress.mutateAsync(data);
    }
    setActiveTab("address-list");
    setAddressId("");
  };

  let latitude = +form.getValues("latitude") || 0;
  let longitude = +form.getValues("longitude") || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center max-h-[448px]">
        <ScrollArea className="relative w-full h-max flex flex-col">
          <div className="w-full flex flex-col gap-1 px-2">
            <FieldLabelAddress form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.labelAddress} />
            <FieldRecipient form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.recipientName} />
            <FieldPhone form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.phone} />
            <FieldProvince setProvinceId={setProvinceId} form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.provinceId} />
            <FieldCity provinceId={provinceId} form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.cityId} />
            <FieldAddress form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.address} />
            <FieldCoordinate form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.coordinate} latitude={latitude} longitude={longitude} />
            <FieldLatitude form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.latitude} />
            <FieldLongitude form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.longitude} />
            <FieldNote form={form} errorMessage={createUserAddress.error?.errors?.fieldErrors?.note} />
            <FieldCheckBox form={form} />
          </div>
        </ScrollArea>
        <div className="w-full pt-4">
          <Button type="submit" className="w-full">
            {type === "create" ? "Create new address" : `Update ${address?.labelAddress}`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
