import { userApiProtected } from "~services/api/user.api"

interface apiResponse<T> {
    body: T,
    message: string,
    success: boolean
}

export const updatePrivacySetting = async (state: boolean) => {
    return (await userApiProtected.patch<apiResponse<{ privateAccount: boolean }>>("/settings/privacy",
        {
            state
        }
    )).data;
}

export const generateResetLink = async (email: string) => {
    const response = await userApiProtected.post<apiResponse<null>>("/settings/reset-password", {
        email
    });

    return response.data.message
}

export const resetPassword = async ({ newPassword, token }:
    {
        newPassword: string,
        token: string
    }
) => {
    const response = await userApiProtected.patch<apiResponse<null>>(`/settings/reset-password?token=${token}`, {
        newPassword
    })

    return response.data
}