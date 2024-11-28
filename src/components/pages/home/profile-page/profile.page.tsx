import { useParams } from "react-router-dom";
import ProfileData from "./partials/profile.data";
import ProfilePosts from "./partials/profile.posts";
import { Suspense, useEffect, useState } from "react";
import { protectedApi } from "~services/api/http";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { LuLoader } from "react-icons/lu";

const ProfilePage = () => {
    const { username } = useParams();
    const user_id = useAppSelector(state => state.user._id);
    const [profileDetails, setProfileDetails] = useState<any>(null);
    const [posts, setPosts] = useState<T_Post[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const { data: { body } } = await protectedApi.get(`/profile/${username}`, {
                    headers: {
                        "X-user-id": user_id
                    }
                });

                setPosts(body.posts);

            } catch (error) {
                console.log("From ProfilePage", error)
            }
        })();
    }, [username]);

    return (
        <div className="mobile:mx-12">
            <ProfileData profileDetails={profileDetails} />
            <ProfilePosts posts={posts} />
        </div>
    )
}

export default ProfilePage
