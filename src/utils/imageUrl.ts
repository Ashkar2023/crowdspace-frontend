export const buildImageUrl = (img_url: string = "") => {
    return new URL(img_url, import.meta.env.VITE_MEDIA_STORAGE_URL );
}

export type fallbackType = "post" | "user" | "image";

export const getFallbackImage = (imgFor: fallbackType) => {
    const urls: Record<fallbackType, string> = {
        "post": "/defaults/1479.gif",
        "user": "/defaults/user.png",
        "image": "/defaults/image.svg",
    }
    
    return new URL(urls[imgFor], import.meta.env.VITE_MEDIA_STORAGE_URL );
}