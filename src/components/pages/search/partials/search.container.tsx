import { Avatar, Input, Skeleton } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { searchQueryFetch } from "~services/query/search.query";
import { IBasicUser } from "~types/dto/user.dto";
import { debounce } from "~utils/debounce";
import { buildImageUrl } from "~utils/imageUrl";

export const SearchContainer = () => {
    const naviate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending, isSuccess, data, submittedAt } = useMutation({
        mutationKey: ["search"], //try to cache searches
        mutationFn: (query: string) => {
            return searchQueryFetch(query)
        }
    })

    const debouncedQueryFetch = useCallback(debounce(mutate, 400), [])

    return (
        <div className="h-full border-r border-app-tertiary p-4">
            <Input
                isClearable
                radius="md"
                startContent={<LuSearch size={20} />}
                onValueChange={debouncedQueryFetch}
                ref={searchInputRef}
            />

            <div className={`users w-full ${data?.body.results.length || isPending ? "border-b-2" : ""} border-app-secondary my-3 py-2`}>
                {
                    isPending ?
                        Array.from({ length: 5 }).map((v, i) => {
                            return (
                                <div className="flex h-16" key={i}>
                                    <Skeleton className="h-4/5 self-center mx-2 aspect-square rounded-full" />
                                    <div className="flex-grow my-auto space-y-1.5">
                                        <Skeleton className="w-1/2 h-5 rounded-lg mb-1" />
                                        <Skeleton className="w-3/4 h-4 rounded-lg" />
                                    </div>
                                </div>
                            )
                        }) :
                        isSuccess && data?.body.results.length ?
                            data?.body.results.map((user: IBasicUser, index: number) => {

                                const spanRegex = new RegExp(searchInputRef.current?.value as string, "i");
                                const styledUsername = user.username //further optimize
                                    .replace(spanRegex,
                                        (match) => `<span class="text-app-t-primary font-semibold">${match}</span>`
                                    )

                                return (
                                    <div
                                        className="flex h-16 px-2 hover:bg-gradient-to-tl from-app-secondary to-app-tertiary cursor-pointer rounded-lg"
                                        onClick={() => {
                                            naviate(`/profile/@${user.username}`)
                                        }}
                                        key={user.username}
                                    >

                                        <Avatar
                                            src={buildImageUrl(user.avatar)}
                                            name={user.displayname}
                                            className="w-12 h-12 self-center mr-2 aspect-square rounded-full overflow-clip border border-app-tertiary"
                                            showFallback
                                        />

                                        <div className="flex-grow mt-2">
                                            <h3
                                                className="text-base font-light text-slate-200"
                                                dangerouslySetInnerHTML={{ __html: styledUsername }} //sanitize the input before dangerously set html or find other way
                                            ></h3>
                                            <p className="text-sm text-app-t-secondary">{user.displayname}</p>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            isSuccess && searchInputRef.current?.dataset.filled ?
                                <div className="text-center text-sm font-thin">
                                    No results found
                                </div>
                                :
                                null

                }
            </div>
        </div>
    )
}