export const buildImageUrl = (img_url: string = "") => {
    return import.meta.env.VITE_MEDIA_STORAGE_URL + img_url;
}

export type fallbackType = "post" | "user";

export const getFallbackImage = (imgFor: fallbackType) => {
    const urls: Record<fallbackType, string> = {
        // "post": "/defaults/LOADING.gif",
        "post": "/defaults/1479.gif",
        "user": "/defaults/user.png",
    }
    
    return import.meta.env.VITE_MEDIA_STORAGE_URL + urls[imgFor];
}