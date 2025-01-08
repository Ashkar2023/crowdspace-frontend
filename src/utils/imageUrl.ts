export const buildImageUrl = (img_url: string = "") => {
    return new URL(img_url, import.meta.env.VITE_MEDIA_STORAGE_URL );
}

export type fallbackType = "post" | "user";

export const getFallbackImage = (imgFor: fallbackType) => {
    const urls: Record<fallbackType, string> = {
        "post": "/defaults/1479.gif",
        "user": "/defaults/user.png",
    }
    
    return new URL(urls[imgFor], import.meta.env.VITE_MEDIA_STORAGE_URL );
}