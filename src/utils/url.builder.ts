export const buildImageUrl = (img_url: string = "") => {
    return new URL(img_url, import.meta.env.VITE_MEDIA_STORAGE_URL);
}

export const buildPostUrl = (post_url: string) => {
    return new URL("post/" + post_url, window.location.origin).href;
}

export type fallbackType = "post" | "image";

export const getFallbackImage = (imgFor: fallbackType) => {
    const urls: Record<fallbackType, string> = {
        "post": "/defaults/post.jpg",
        "image": "/defaults/image.png",
    }

    return new URL(urls[imgFor], import.meta.env.VITE_MEDIA_STORAGE_URL);
}