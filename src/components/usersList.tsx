// import { user, Avatar } from "@nextui-org/react"
// import { buildImageUrl } from "~utils/imageUrl"

// export const UsersList = () => {
//     return (
//         <div
//             className="flex h-16 px-2 hover:bg-gradient-to-tl from-app-secondary to-app-tertiary cursor-pointer rounded-lg"
//             onClick={() => {
//                 naviate(`/profile/@${user.username}`)
//             }}
//             key={user.username}
//         >

//             <Avatar
//                 src={buildImageUrl(user.avatar).href}
//                 name={user.displayname}
//                 className="w-12 h-12 self-center mr-2 aspect-square rounded-full overflow-clip border border-app-tertiary"
//                 showFallback
//             />

//             <div className="flex-grow mt-2">
//                 <h3
//                     className="text-base font-light text-slate-200"
//                     dangerouslySetInnerHTML={{ __html: styledUsername }} // CHANGE sanitize the input before dangerously set html or find other way
//                 ></h3>
//                 <p className="text-sm text-app-t-secondary">{user.displayname}</p>
//             </div>
//         </div>
//     )
// }
