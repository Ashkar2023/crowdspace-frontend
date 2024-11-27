import { RadioGroup, Radio, cn } from '@nextui-org/react'
import { FC, useEffect } from 'react'
import { LuImage, LuText } from 'react-icons/lu'
import { PostType } from '~types/components/post-modal.types'
import type { PostDataStateProps } from '~types/components/post-modal.types'

type Props = PostDataStateProps;

const PostTypeSelector: FC<Props> = ({ updatePostDataState, postDataState }) => {


    return (
        <RadioGroup
            defaultValue={postDataState.postType}
            onValueChange={(value) => {
                updatePostDataState("postType", value as PostType)
            }}

            classNames={{
                wrapper: ["justify-center"],
                label: ["text-app-t-secondary", "underline", "underline-offset-2", "text-sm", "font-light", "self-center"],
            }}
            orientation="horizontal"
        >
            <Radio
                value={PostType.TEXT}

                classNames={{ // reuse repeating code
                    base: cn(
                        "m-0 items-center justify-between",
                        "cursor-pointer max-w-max rounded-2xl gap-1 p-3 border-2 border-transparent",
                        "data-[selected=true]:border-primary hover:bg-app-tertiary"
                    ),
                    description: ["text-xs"]
                }}
            >
                <span className="text-app-t-secondary">Text<LuText /></span>
            </Radio>
            <Radio
                value={PostType.MEDIA}

                classNames={{ // reuse repeating code
                    base: cn(
                        "m-0 items-center justify-between",
                        "cursor-pointer rounded-2xl gap-1 p-3 border-2 border-transparent ",
                        "data-[selected=true]:border-primary hover:bg-app-tertiary"
                    ),
                    description: ["text-xs"]
                }}
            >
                <span className="text-app-t-secondary">Media<LuImage /></span>
            </Radio>
        </RadioGroup>
    )
}

export default PostTypeSelector;