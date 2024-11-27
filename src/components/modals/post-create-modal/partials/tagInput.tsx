import { ScrollShadow, Input, Chip } from "@nextui-org/react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { PostDataStateProps } from "~types/components/post-modal.types";

type Props = PostDataStateProps;

const TagInput: FC<Props> = ({ postDataState, updatePostDataState }) => {
    const [tagInput, setTagInput] = useState("");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const trimmedValue = tagInput.trim();
            if (trimmedValue) {
                updatePostDataState("tags", [trimmedValue], "push", 0);
                setTagInput("");
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    return (
        <div className='flex flex-wrap my-2'>
            <Input
                label="Tags"
                variant='bordered'
                className='min-w-7 focus-visible:outline-dashed'
                classNames={{
                    label: ["text-app-t-primary"],
                    input: ["!text-app-t-secondary"],
                }}
                value={tagInput}
                onKeyDown={handleAddTag}
                onChange={handleInputChange}
            />
            <ScrollShadow
                className='max-h-16 w-full my-2 overflow-y-scroll scrollbar-hide'
                size={15}
                // OPTIMIZE - can do event delegation
            >
                {postDataState.tags.map((tag, index) => (
                    <Chip
                        key={tag}
                        className="m-0.5 chip"
                        property="JUST"

                        onClose={(e) => {
                            updatePostDataState("tags", [tag],"remove", index);
                        }}
                    >
                        {tag}
                    </Chip>
                ))}
            </ScrollShadow>
        </div>
    )
}

export default TagInput;