export enum PostWizardStages {
    SELECT_TYPE,
    SELECT_FILES,
    INPUT_METADATA,
}

export enum PostType {
    TEXT = "text",
    MEDIA = "media"
}

export enum PostVisibility {
    EVERYONE = "everyone",
    FOLLOWERS_ONLY = "followers_only"
}

export type GeoPoint = {
    type: "Point",
    coordinates: number[],
    index: "2dsphere",
}

export type PostMetadata = {
    postType: PostType,
    caption: string,
    tags: string[],
    visibility: PostVisibility,
    mentions: string[],
    files: FileList | null,
    location?: GeoPoint,
    thumbnail?: string
}

// export type PostDataStateUpdateHandler = <K extends keyof PostMetadata>(key: K, value: PostMetadata[K], type?: "remove" | "push", index?: number) => void
export interface PostDataStateUpdateHandler {
    <K extends keyof PostMetadata>(key: K, value: PostMetadata[K]): void
    <K extends keyof PostMetadata>(key: K, value: PostMetadata[K], type: "remove" | "push", index: number): void
} 

export type PostDataStateProps = {
    postDataState: PostMetadata;
    updatePostDataState: PostDataStateUpdateHandler;
}


