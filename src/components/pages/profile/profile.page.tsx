import { useNavigate, useParams } from "react-router-dom";
import ProfileData from "./partials/profile.data";
import ProfilePosts from "./partials/profile.posts";
import { useEffect, useState } from "react";
import { protectedApi } from "~services/api/http";
import { useAppSelector } from "~hooks/useReduxHooks";
import { T_Post } from "~types/dto/post.dto";
import { ProfileStateType } from "~types/components/profile.types";
import { IFollow } from "~types/dto/follow.dto";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { LuLock } from "react-icons/lu";

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
    const [profileDetails, setProfileDetails] = useState<ProfileStateType | null>(null);
    const [posts, setPosts] = useState<T_Post[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        (async () => {
            try {
                const { data: { body } } = await protectedApi.get(`/profile/${encodeURIComponent(username!)}`, { //contains both posts and user details
                    headers: {
                        "X-logged-in-username": loggedInUsername
                    }
                }); //contains both posts and user details
                setPosts(body.posts);

                setProfileDetails({
                    profile: {
                        ...body.profile,
                    },
                    incomingFollow: body.incomingFollow,
                    outgoingFollow: body.outgoingFollow,
                    accessGranted: body.accessGranted
                });

            } catch (error) {
                if (!(error instanceof AxiosError)) return;

                console.log("From ProfilePage", error)
                toast.error((error as AxiosError).message)

                if (error.status === 500) {
                    navigate("/")
                }
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
                profileData={profileDetails}
                setProfileDetails={setProfileDetails}
            />
            {/* </Suspense> */}
            {
                profileDetails?.accessGranted ?
                    (
                        <ProfilePosts posts={posts} setPosts={setPosts} />
                    ) :
                    (
                        <div className="flex flex-col items-center justify-center mt-10 p-6 border border-app-tertiary text-app-t-primary">
                            <LuLock size={30} />
                            <h2 className="text-xl font-semibold">This Account is Private</h2>
                            <p className="text-sm text-gray-400 mt-2">
                                Follow this user to see their posts.
                            </p>
                        </div>
                    )
            }
        </div>
    )
}

export default ProfilePage
