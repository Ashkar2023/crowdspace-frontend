import { FC } from "react"

type Props = {
    profileDetails: any, // Give valid type
}

const ProfileData: FC<Props> = ({ profileDetails }) => {
    return (
        <div className="max-w-4xl p-4 space-y-4">
            {/* Profile header */}
            <div className="flex items-center space-x-4">
                {/* Profile picture */}
                <div className="size-32 rounded-full bg-gray-800"></div>

                {/* Username and buttons */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                    <div className="flex space-x-2">
                        <div className="h-8 bg-gray-800 rounded w-24"></div>
                        <div className="h-8 bg-gray-800 rounded w-24"></div>
                    </div>
                </div>
            </div>

            {/* Follower/Following counts */}
            <div className="flex justify-around">
                {['posts', 'followers', 'following'].map((item) => (
                    <div key={item} className="text-center">
                        <div className="h-5 bg-gray-800 rounded w-12 mx-auto mb-1"></div>
                        <div className="h-4 bg-gray-800 rounded w-16"></div>
                    </div>
                ))}
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-2/6"></div>
                <div className="h-4 bg-gray-800 rounded w-3/6"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>

            {/* Story highlights */}
            <div className="flex space-x-4 overflow-x-auto py-2">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gray-800"></div>
                        <div className="h-3 bg-gray-800 rounded w-12 mx-auto mt-1"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProfileData