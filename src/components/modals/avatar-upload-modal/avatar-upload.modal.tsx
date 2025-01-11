import { Button, Modal, ModalContent, UseDisclosureProps } from "@nextui-org/react"
import { AxiosError } from "axios"
import { FC, useEffect, useRef, useState } from "react"
import { ArbitraryProps, CircleStencil, Cropper, CropperRef, ImageRestriction } from "react-advanced-cropper"
import "react-advanced-cropper/dist/style.css"
import toast from "react-hot-toast"
import { mediaApi } from "~services/api/media.api"

interface Props {
    disclosure: UseDisclosureProps
}

export const ProfileImageUploadModal: FC<Props> = ({ disclosure }) => {
    const cropperRef = useRef<CropperRef>(null);
    const [file, setFile] = useState<File | undefined>(undefined)
    const [ObjectUrl, setObjectUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (ObjectUrl) {
            return () => {
                URL.revokeObjectURL(ObjectUrl);
            }
        }
    }, [ObjectUrl])

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onChange}
            onClose={disclosure.onClose}

            radius="sm"
            size="lg"
            hideCloseButton={true}
            isDismissable={true}
            backdrop="opaque"
            className=""
            classNames={{

            }}
        >
            <ModalContent className="">
                {(onClose) => (
                    <div
                        className="bg-app-secondary"
                    >
                        <div
                            className="w-full min-h-[50px]"
                        >
                            <input
                                type="file"
                                multiple={false}
                                onChange={(e) => {
                                    const file = e.target.files?.item(0);

                                    if (file) {
                                        setObjectUrl(URL.createObjectURL(file))
                                    }
                                }}
                            />
                        </div>
                        <Cropper
                            defaultSize={(state, settings) => {
                                
                                return {
                                    height: state.imageSize.height,
                                    width: state.imageSize.width
                                }
                            }}
                            boundaryClassName="bg-app-secondary"
                            stencilComponent={CircleStencil}
                            stencilProps={{
                                aspectRatio: 1,
                                handlers:false,
                                movable:false,
                                resizable:false,
                                grid:true
                            }}
                            
                            src={ObjectUrl}
                            className="size-[300px] justify-self-center rounded"
                            ref={cropperRef}
                        />
                        <div className="flex justify-end py-2 px-4">
                            <Button
                                onClick={async () => {
                                    const canvas = cropperRef.current?.getCanvas();

                                    const blobData = await new Promise<Blob>(resolve => {
                                        canvas?.toBlob((blob) => {
                                            blob instanceof Blob && resolve(blob);
                                        })
                                    })

                                    const formdata = new FormData();
                                    formdata.append("avatar", blobData, "name kodkada");

                                    /* if possible do presigned url uploads */
                                    try {
                                        const response = await mediaApi.patch(`/avatar`, formdata);
                                        response.data.success && onClose() && setFile(undefined);
                                    } catch (error) {
                                        toast.error((error as AxiosError).message)
                                    }
                                }}
                            >
                                update
                            </Button>
                        </div>
                    </div>
                )}
            </ModalContent>
        </Modal>
    )
}
