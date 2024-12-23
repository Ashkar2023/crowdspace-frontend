import { useParams } from "react-router-dom";
import ProfileData from "./partials/profile.data";
import ProfilePosts from "./partials/profile.posts";
import { Suspense, useEffect, useState } from "react";
import { protectedApi } from "~services/api/http";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { LuLoader } from "react-icons/lu";
import { ProfileStateType } from "~types/components/profile.types";
import { IUser } from "~types/dto/user.dto";
import { IFollow } from "~types/dto/follow.dto";

export interface IFollows {
    followers: IFollow[];
    followings: IFollow[];
    followingsCount: number;
    followersCount: number;
};

const initialFollows: IFollows = {
    followers: [],
    followings: [],
    followersCount: 0,
    followingsCount: 0
}

const ProfilePage = () => {
    const { username } = useParams();
    const loggedInUsername = useAppSelector(state => state.user.username);
    const [profileDetails, setProfileDetails] = useState<ProfileStateType | null>(null); // GIVE Type for state here
    const [posts, setPosts] = useState<T_Post[]>([]);
    const [follows, setFollows] = useState<IFollows>(initialFollows);


    useEffect(() => {
        (async () => {
            try {
                const { data: { body } } = await protectedApi.get(`/profile/${username}`, { //contains both posts and user details
                    headers: {
                        "X-logged-in-username": loggedInUsername //do i need this here
                    }
                });

                setPosts(body.posts);
                console.log(body)

                /**
                 * CHANGE
                 * the backend only returns posts,(excluding follows) for current user
                 * 
                */

                // comeup with ideas to cache or fetch follows
                const { data } = await protectedApi.get(`/user/${body.profile._id}/follows`);

                setFollows(data.body);
                setProfileDetails({
                    profile: {
                        ...body.profile,
                        followersCount: data.body.followersCount,
                        followingsCount: data.body.followingsCount
                    },
                    incomingFollow: body.incomingFollow,
                    outgoingFollow: body.outgoingFollow,
                });

            } catch (error) {
                console.log("From ProfilePage", error)
            }
        })();

        () => {
            setPosts(prev => []);
        }
    }, [username]);

    return (
        <div className="mobile:mx-12">
            {/* <Suspense fallback={<LuLoader className="animate-spin" />}> */}
            <ProfileData
                profileDetails={profileDetails}
                setProfileDetails={setProfileDetails}
                follows={follows}
            />
            {/* </Suspense> */}
            <ProfilePosts posts={posts} setPosts={setPosts} />
        </div>
    )
}

export default ProfilePage
