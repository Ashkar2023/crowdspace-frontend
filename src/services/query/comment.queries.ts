import { protectedApi } from "~services/api/http";
import { userApiProtected } from "~services/api/user.api"

export const patchComment = async ({
    commentBody,
    commentId
}: {
    commentId: string,
    commentBody: string
}) => {
    return (await protectedApi.patch(`/comments/${commentId}`, {
        commentBody
    })).data;
} 