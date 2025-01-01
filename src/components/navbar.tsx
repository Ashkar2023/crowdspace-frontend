import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Skeleton, Switch, User } from '@nextui-org/react';
import { Dispatch, FC, MouseEvent, useContext, useState } from 'react';
import { LuBell, LuCompass, LuHome, LuLogOut, LuMessageCircle, LuPackage, LuPackageOpen, LuPen, LuSearch, LuSettings2, LuSun, LuUserSquare2, LuX } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import { clearUser } from '~services/state/user.slice';
import { userApiProtected } from '~services/api/user.api';
import { RiMoonFill } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '~hooks/useReduxHooks';
import { AxiosError } from 'axios';

import type { NavItem } from '~types/components/navitem.types';
import { ThemeContext } from '~/context/themeContext';
import Breakpoints from '~constants/breakpoints.constants';
import { SocketContext } from '~/context/socketContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import fetchNotifications from '~services/query/notification.queries';
import { buildImageUrl } from '~utils/imageUrl';
import { NotificationPhrases } from '~constants/notification.phrases';
import { NotificationKind } from '~constants/notification';

const navItems: NavItem[] = [
    { href: '/', label: "Home", icon: LuHome, mobileNav: true },
    { href: '/search', label: "Search", icon: LuSearch, mobileNav: true },
    { href: '/explore', label: "Explore", icon: LuCompass, mobileNav: true },
    // { href: '/shots', label: "Shots", icon: LuFilm, mobileNav: true },
    // { href: '/communities', label: "Communities", icon: LuUsers, mobileNav: false },
    { href: '/messages', label: "Messages", icon: LuMessageCircle, mobileNav: false },
    // { href: '/updates', label: "Updates", icon: LuBell, mobileNav: false },
    // { href: '/openmic', label: "Open mic", icon: LuRadio, mobileNav: false },
]

type Props = {
    toggleCreatePostModal: () => void,
    postButtonDisabled: boolean,
    updatesBoxState: [boolean, Dispatch<React.SetStateAction<boolean>>]
}

// Component start
const Navbar: FC<Props> = ({
    toggleCreatePostModal,
    postButtonDisabled,
    updatesBoxState: [updatesOpen, setUpdatesOpen]
}) => {
    const themeContext = useContext(ThemeContext);
    const { Socket, socketConnected } = useContext(SocketContext);
    const navigate = useNavigate();

    const selectedTheme = useAppSelector(state => state.app.theme);
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [isMoreOpen, setMoreOpen] = useState<boolean>(false);

    const handleLogout = async (e: MouseEvent) => {
        try {
            await userApiProtected.get("/auth/logout");
            dispatch(clearUser());

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.message);
            }
        }
    }

    const { data, error, isFetching, isSuccess } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
    })

    return (
        <>
            <div className="block md:flex md:flex-col h-full w-full px-auto bg-app-primary relative z-10 ">

                <div className='hidden md:flex justify-center my-6'>
                    <img src={`/crowdspace-logo-${themeContext?.theme}-theme.svg`} className='h-12 w-12' draggable="false" />
                </div>
                <nav className="flex flex-row fixed justify-evenly mobile:justify-normal border-t-1.5 border-gray-300 mobile:border-none
                                mobile:static bottom-0 md:flex-col flex-grow overflow-none md:mx-6 font-semibold
                                mobile:space-y-2
                                bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] mobile:bg-none"
                >
                    {navItems.map(item => (
                        <Link
                            to={item.href}
                            key={item.href}
                            className={`items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 mobile:hover:bg-app-tertiary ${item.mobileNav ? " flex " : " mobile:flex hidden "}`}
                        >
                            <item.icon className='size-6' />
                            <span className='hidden md:inline'>{item.label}</span>
                        </Link>
                    ))}

                    {/* Updates(notifications) nav item */}
                    <div
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 mobile:hover:bg-app-tertiary cursor-pointer`}
                        onClick={() => setUpdatesOpen(isOpen => !isOpen)}
                    >
                        <LuBell className='size-6' />
                        <span className='hidden md:inline'>Updates</span>
                    </div>

                    {/* Avatar For mobile view */}
                    <Link
                        to={`/profile/@${userState.username}`}
                        className={`items-center gap-3 rounded-lg px-3 py-3 mobile:py-2
                            transition-all
                            flex mobile:hidden `}
                    >
                        <Avatar
                            src={userState.avatar}
                            showFallback
                            name={userState.displayname!}
                            size='sm'
                        />
                    </Link>
                </nav>
                <div className='mx-8 hidden md:flex mb-4 justify-between gap-2'>
                    <Dropdown
                        placement='top'
                        backdrop='opaque'
                        radius='sm'
                        type='menu'
                        shadow='lg'
                        className='bg-app-tertiary text-app-t-primary'
                        onOpenChange={(isOpen) => setMoreOpen(isOpen)}
                    >
                        <DropdownTrigger>
                            <User
                                className='cursor-pointer flex flex-grow justify-start'
                                classNames={{
                                    base: ["bg-app-secondary", "p-2", "px-3",
                                        "rounded-2xl", "overflow-hidden", "min-w-44"],
                                    name: ["max-w-24", "truncate", "text-app-t-primary"],
                                    description: ["max-w-24", "truncate", "text-app-t-secondary"]
                                }}
                                name={"@" + userState.username}
                                description={userState.displayname}
                                avatarProps={{
                                    src: buildImageUrl(userState.avatar as string),
                                    showFallback: true,
                                    className: "border border-app-tertiary",
                                    name:userState.displayname!
                                }}
                            >
                            </User>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownSection showDivider>
                                <DropdownItem
                                    className='cursor-default data-[hover=true]:bg-app-secondary data-[hover=true]:text-t-app-primary'
                                    closeOnSelect={false}
                                    endContent={
                                        <Switch
                                            size='md'
                                            isSelected={selectedTheme === "dark"}
                                            onValueChange={(bool) => {
                                                themeContext?.toggleTheme(bool === true ? "dark" : "light");
                                            }}
                                            classNames={{
                                                wrapper: ["group-data-[selected=true]:bg-black", "bg-app-secondary"],
                                            }}
                                            thumbIcon={selectedTheme === "dark" ? <RiMoonFill /> : <LuSun />}
                                        />
                                    }
                                    textValue='theme'
                                >
                                    Theme
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider>
                                <DropdownItem
                                    // SHOULDN'T DO href on this. It will refresh the application
                                    onClick={() => { navigate("/settings") }}
                                    startContent={<LuSettings2 size={18} />}
                                    textValue='Settings'
                                    className='data-[hover=true]:bg-app-secondary data-[hover=true]:text-t-app-primary'
                                >
                                    Settings
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => { navigate(`/profile/@${userState.username}`) }}
                                    startContent={<LuUserSquare2 size={18} />}
                                    textValue='Profile'
                                    className='data-[hover=true]:bg-app-secondary data-[hover=true]:text-t-app-primary'
                                >
                                    Profile
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection>
                                <DropdownItem
                                    key="logout"
                                    color='danger'
                                    startContent={<LuLogOut />}
                                    onClick={handleLogout}
                                >Logout
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>

                    {/* POST Button */}
                    {!postButtonDisabled
                        &&
                        <Button
                            className='text-base self-center hidden md:flex data-[disabled=true]:bg-blue-700'

                            color='primary'
                            radius='md'
                            // isDisabled={postDisabled}
                            onPress={toggleCreatePostModal}
                            isIconOnly={themeContext?.screenWidth! < Breakpoints.LG ? true : false}
                        >
                            <span className='hidden lg:flex '>Post</span>
                            <LuPen size={18} />
                        </Button>}
                </div>

                {/* Updates box */}
                <AnimatePresence>
                    {updatesOpen &&

                        <motion.div
                            initial={{ opacity: 0, x: -70 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -70 }}
                            transition={{ duration: 0.2 }}
                            className='absolute bg-app-primary -right-full w-full h-full border-x border-app-tertiary overflow-y-scroll'
                        >
                            <div className='w-full flex p-4 justify-between'>
                                <h2 className='text-2xl font-semibold'>Updates</h2>
                                <Button
                                    isIconOnly
                                    size='sm'
                                    radius="md"
                                    variant='light'
                                    endContent={<LuX size={18} color='gray' />}
                                    onPress={() => setUpdatesOpen(false)}
                                />
                            </div>
                            <div className='divide-y-1 divide-app-tertiary'>
                                {
                                    isSuccess && data?.body.count! > 0 ?
                                        data?.body.notifications.map((notf, index) => {
                                            return (
                                                <div className='flex w-full px-2 py-3'>

                                                    <img
                                                        src={buildImageUrl(notf.actor.avatar)}
                                                        alt={notf.actor.displayname}
                                                        className='size-12 rounded-full bg-app-tertiary'
                                                    />

                                                    <p className="font-extralight my-auto ms-2 h-full">
                                                        {NotificationPhrases[notf.type.toLowerCase() as keyof typeof NotificationKind](notf.actor.username)}
                                                    </p>
                                                </div>
                                            )
                                        })
                                        :
                                        <div className='text-center font-thin'>
                                            <span>No new updates</span>
                                        </div>
                                }
                                {
                                    isFetching &&
                                    Array.from({ length: 6 }).map((_, i) => {
                                        return (
                                            <div className='flex w-full px-2 py-3'>
                                                <Skeleton className='size-12 rounded-full' />
                                                <div className="flex flex-grow my-auto ms-3">
                                                    <Skeleton className=' h-4 w-3/4 rounded-lg' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </>
    )
}

export default Navbar;
