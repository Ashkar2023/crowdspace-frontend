import { Textarea } from '@nextui-org/react';
import { ChangeEvent, FC, useCallback } from 'react';
import { PostDataStateProps } from '~types/components/post-modal.types';
import { debounce } from '~utils/debounce';
import TagInput from './tagInput';

type Props = PostDataStateProps;

const PostSubmitForm: FC<Props> = ({ updatePostDataState, postDataState }) => {

    const captionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updatePostDataState("caption", e.target.value);
    };

    const debouncedCaption = useCallback(debounce(captionHandler, 400), []);

    return (
        <div className=''>
            <Textarea
                label="Caption"
                // maxRows={1} for height according to rows
                maxLength={500}
                variant='bordered'
                className=''
                classNames={{
                    label: ["text-app-t-primary"],
                    input: ["!text-app-t-secondary"],
                }}
                onChange={debouncedCaption}
            />

            <TagInput
                updatePostDataState={updatePostDataState}
                postDataState={postDataState}
            />
        </div>
    )
}

export default PostSubmitForm;