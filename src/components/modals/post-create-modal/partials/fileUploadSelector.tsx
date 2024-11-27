import { Input } from "@nextui-org/react";
import { ChangeEvent, FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PostDataStateProps } from "~types/components/post-modal.types";

type Props = PostDataStateProps;

const FileUploadSelector: FC<Props> = ({ postDataState, updatePostDataState }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<string[]>([]);

    /* 
     * If possible change the image reading to depend on this component render
     * so when going forward & coming back to this component wouldnt lose the readed files
     */
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const filesList = e.target.files;

        if (filesList?.length! > 5) {
            toast.error("Max 5 files", { position: "top-center" });
            inputRef.current!.value = "";
            return
        }

        updatePostDataState("files", e.target.files!);

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

    return (
        <div className="flex flex-col max-h-[500px] transition-all ">
            <Input
                type="file"
                multiple
                color={"primary"}
                className=""
                ref={inputRef}
                onChange={inputHandler}
                accept="video/mp4, image/jpeg, image/png, image/webp"
            >
            </Input>

            <div className="flex flex-wrap gap-2 mt-4 justify-center" id="imgs_wrapper">
                {
                    files.map((fileSrc, index) => (
                        <img
                            className="h-24 max-w-28 rounded-xl"
                            src={fileSrc}
                            key={index}
                            alt={`File ${index + 1}`}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default FileUploadSelector;