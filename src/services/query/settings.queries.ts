import { userApiProtected } from "~services/api/user.api"

interface apiResponse {
    body: {
        privateAccount: boolean
    },
    message:string,
    success:boolean
}

export const updatePrivacySetting = async (state: boolean) => {
    return (await userApiProtected.patch<apiResponse>("/settings/privacy",
        {
            state
        }
    )).data;
}