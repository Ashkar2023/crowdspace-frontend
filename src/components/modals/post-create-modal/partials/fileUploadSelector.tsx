import { Input } from "@nextui-org/react";
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
import { Cropper, CropperImage, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import toast from "react-hot-toast";
import { PostDataStateProps } from "~types/components/post-modal.types";
import { debounce } from "~utils/debounce";
import { getFallbackImage } from "~utils/url.builder";

type Props = PostDataStateProps;

const FileUploadSelector: FC<Props> = ({ postDataState, updatePostDataState }) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<CropperRef>(null);
    const previewWrapperRef = useRef<HTMLDivElement>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    /* 
     * If possible change the image reading to depend on this component render
     * so when going forward & coming back to this component wouldnt lose the readed files
     */

    const imageSelector = (event: MouseEvent): void => {
        const imgEl = event.target as HTMLImageElement;

        setSelectedIndex(parseInt(imgEl.dataset.index ?? '0'));
    };

    useEffect(() => {

        previewWrapperRef.current?.addEventListener("click", imageSelector); //OPTIMIZE if possible

        return () => {
            previewWrapperRef.current?.removeEventListener("click", imageSelector)

        }
    }, [])

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const filesList = e.target.files;

        if (filesList && filesList.length > 5) {
            toast.error("Max 5 files", { position: "top-center" });
            inputRef.current!.value = "";
            return
        }

        if (filesList) {
            const blobFiles: File[] = [];

            for (let file of filesList!) {
                blobFiles.push(new File([file], file.name, {
                    type: file.type,
                    lastModified: file.lastModified
                }))
            }

            updatePostDataState("files", blobFiles);
        }

        if (filesList?.length) {

            const promiseArray: Promise<string>[] = []

            Array.from(filesList).forEach((file, index) => {
                const reader = new FileReader();
                const readerPromise = new Promise<string>((resolve, reject) => {

                    reader.onload = (e) => { // callback to work after reading the file
                        if (e.target?.result) {
                            resolve(e.target.result as string);
                        } else {
                            reject(new Error("Error reading " + file.name))
                        }
                    }

                    reader.onerror = (error) => {
                        reject(error)
                    }

                    reader.readAsDataURL(file); //input file to read 
                })

                promiseArray.push(readerPromise);
            })

            Promise.all(promiseArray)
                .then(fileSources => {
                    setFiles(fileSources);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    // 
                })
        } else {
            setFiles([])
        }

    }

    const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob));
        });
    };

    const onChange = useCallback(
        debounce(async (cropper: CropperRef) => {

            const canvas = cropper.getCanvas();

            if (!postDataState.files || !canvas) return;

            const replacedFiles = await Promise.all(

                postDataState.files.map(async (file, index) => {
                    if (index === selectedIndex) {
                        if (index === selectedIndex) {
                            const croppedBlob = await getCanvasBlob(canvas);

                            if (croppedBlob) {
                                return new File([croppedBlob], file.name, { type: croppedBlob.type });
                            }
                        }
                    }

                    return file
                })

            )

            updatePostDataState("files", replacedFiles);

        }, 700),
        [selectedIndex, postDataState.files]
    )

    return (
        <div className="flex flex-col max-h-[500px] transition-all space-y-2 ">
            <Input
                type="file"
                multiple
                color={"primary"}
                className=""
                ref={inputRef}
                onChange={inputHandler}
                accept="video/mp4, image/jpeg, image/png, image/webp"
            />

            <Cropper
                src={files[selectedIndex] ?? getFallbackImage("image")}
                onChange={onChange}
                ref={cropperRef}
                className="cropper h-[350px] w-full rounded-md border-1.5 border-app-tertiary"
                defaultSize={(state, settings) => {
                    return {
                        height: state.imageSize.height,
                        width: state.imageSize.width
                    }
                }}
            />

            <div
                className="flex flex-wrap gap-2 justify-center"
                ref={previewWrapperRef}
            >
                {
                    files.map((fileSrc, index) => (
                        <img
                            className={`h-16 max-w-28 rounded outline-1 ${index === selectedIndex ? "outline outline-2" : ""} hover:outline outline-app-t-primary border-1.5 border-app-tertiary`}
                            src={fileSrc}
                            key={index}
                            data-index={index}
                            alt={`File ${index + 1}`}
                        />
                    ))
                }
            </div>


        </div>
    )
}

export default FileUploadSelector;