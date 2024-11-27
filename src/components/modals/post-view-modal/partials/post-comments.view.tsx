import { Input } from "@nextui-org/react"

export const PostCommentsViewPartial = () => {
    return (
        <div className="border-s border-app-tertiary">
            <div className="flex flex-grow bg-white"></div>
            <div className="h-20 p-2">
                <h3 className="text-lg font-medium">Add comment</h3>
                <div className="flex">
                    <Input variant="bordered" classNames={{}}/>
                </div>
            </div>
        </div>
    )
}
