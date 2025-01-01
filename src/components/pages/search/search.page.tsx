import { useCallback } from "react"
import { SearchContainer } from "./partials/search.container"

export const SearchPage = () => {

    return (
        <div className="grid grid-cols-[6fr_4fr] h-screen">
            <SearchContainer />
        </div>
    )
}
