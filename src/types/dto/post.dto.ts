import { PostType, PostVisibility } from "~types/components/post-modal.types";
import { IBasicUser } from "./user.dto";

export enum MediaEnum {
    IMAGE = "image",
    VIDEO = "video",
    // GIF = "gif"
}

export enum PostStatus {
    PENDING = "pending",
    REMOVED_BY_ADMIN = "removed_by_admin",
    DELETED = "deleted",
    ACTIVE = "active"
}

export type Media = {
    // index: number,
    media_meta: Record<string, any>, // Enhance with resolution, encoding etc
    media_url: string,
    mediaType: MediaEnum,
}

export type GeoPoint = {
    type: "Point",
    coordinates: number[],
    index: "2dsphere",
}

/* REQUIRED POST FIELDs */
export type PostCreateFields = {
    postType: PostType, //type reused from PostMetadata
    caption: string,
    tags: string[],
    media: Media[],
    visibility: PostVisibility, //type reused from PostMetadata
    thumbnail?: string
    mentions: string[],
}

/* PARENT POST TYPE */

export type T_Post = {
    _id: string,
    author: IBasicUser, //last added
    archived: boolean,
    likesCount: number,
    commentsCount: number,
    shareCount: number,
    location?: GeoPoint,
    status: PostStatus,
    viewsCount: number,
    createdAt:string,
    updatedAt:string

} & PostCreateFields;
