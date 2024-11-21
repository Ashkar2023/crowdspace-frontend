export type ProfileReducerState = {
    username: string,
    bio: string,
    links: string[],
    gender : Gender
}

export type Gender = "M" | "F" | undefined ;

export type ProfileReducerAction = 
{ type: "hydrate-links", value : string[]} |
{ type: "add-link", value : string} |
{ type: "remove-link", index : number} |
{ type: "update-bio", value : string} |
{ type: "update-username", value : string} |
{ type: "update-gender", value : Gender};
