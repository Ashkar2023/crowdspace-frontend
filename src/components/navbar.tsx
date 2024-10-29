import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Switch, User } from '@nextui-org/react';
import { useContext, useState } from 'react';
import { LuBell, LuCompass, LuFilm, LuHome, LuLogOut, LuMessageCircle, LuPen, LuRadio, LuSearch, LuSettings2, LuSun, LuUsers, LuUserSquare2 } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { clearUser } from '~services/state/user.slice';
import { userApiProtected } from '~services/api/axios-http';
import { RiMoonFill } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '~hooks/useReduxHooks';
import { AxiosError } from 'axios';

import type { NavItem } from '~types/components/nav';
import type { PressEvent } from '@react-types/shared';
import { ThemeContext } from '~/context/themeContext';


const navItems: NavItem[] = [
    { href: '/', label: "Home", icon: LuHome, mobileNav: true },
    { href: '/search', label: "Search", icon: LuSearch, mobileNav: true },
    { href: '/explore', label: "Explore", icon: LuCompass, mobileNav: true },
    { href: '/shots', label: "Shots", icon: LuFilm, mobileNav: true },
    { href: '/communities', label: "Communities", icon: LuUsers, mobileNav: false },
    { href: '/udpates', label: "Updates", icon: LuBell, mobileNav: false },
    { href: '/messages', label: "Messages", icon: LuMessageCircle, mobileNav: false },
    { href: '/openmic', label: "Open mic", icon: LuRadio, mobileNav: false },
]


// Component start
const Navbar = () => {
    const themeContext = useContext(ThemeContext);

    const selectedTheme = useAppSelector(state => state.app.theme);
    const userState = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    
    const [isMoreOpen, setMoreOpen] = useState<boolean>(false);

    const handleLogout = async (e: PressEvent) => {
        try {
            await userApiProtected.get("/auth/logout");
            dispatch(clearUser());
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.message);
            }
        }
    }

    return (
        <div className="block md:flex md:flex-col h-full w-full px-auto">
            <div className='hidden md:flex justify-center my-6'>
                <img src={`/crowdspace-logo-${themeContext?.theme}-theme.svg`} className='h-12 w-12' />
            </div>
            <nav className="flex flex-row fixed w-full justify-evenly mobile:justify-normal border-t-1.5 border-gray-300 mobile:border-none
                                mobile:static bottom-0 md:flex-col flex-grow overflow-none md:mx-6 font-semibold
                                mobile:space-y-2
                                bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] mobile:bg-none"
            >
                {navItems.map(item => (
                    <Link
                        to={item.href}
                        key={item.href}
                        className={`items-center gap-3 rounded-lg px-3 py-2
                                    transition-all mobile:hover:bg-app-tertiary
                                    ${item.mobileNav ? " flex " : " mobile:flex hidden "}`}
                    >
                        <item.icon className='size-6' />
                        <span className='hidden md:inline'>{item.label}</span>
                    </Link>
                ))}
                <Link
                    to="/profile"
                    className={`items-center gap-3 rounded-lg px-3 py-3 mobile:py-2
                            transition-all
                            flex mobile:hidden `}
                >
                    <Avatar src={userState.avatar} showFallback size='sm' />
                </Link>
            </nav>
            <div className='mx-8 hidden md:flex mb-4 justify-between gap-2'>
                <Dropdown
                    placement='top'
                    backdrop='transparent'
                    radius='sm'
                    type='menu'
                    shadow='lg'
                    onOpenChange={(isOpen) => setMoreOpen(isOpen)}
                >
                    <DropdownTrigger>
                        <User
                            className='cursor-pointer flex flex-grow justify-start'
                            classNames={{
                                base: ["bg-slate-200", "p-2", "px-3",
                                    "rounded-2xl", "overflow-hidden", "min-w-44"],
                                name: ["max-w-24", "truncate"]
                            }}
                            name={"@" + userState.username}
                            description={userState.displayname}
                            avatarProps={{
                                src: userState.avatar,
                            }}
                        >
                        </User>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownSection showDivider>
                            <DropdownItem
                                className='cursor-default'
                                closeOnSelect={false}
                                endContent={
                                    <Switch
                                        size='md'
                                        isSelected={selectedTheme === "dark"}
                                        onValueChange={(bool) => {
                                            themeContext?.toggleTheme(bool === true ? "dark" : "light");
                                        }}
                                        classNames={{
                                            wrapper: ["group-data-[selected=true]:bg-slate-800"]
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
                                href='/settings'
                                startContent={<LuSettings2 size={18} />}
                                textValue='Settings'
                            >
                                Settings
                            </DropdownItem>
                            <DropdownItem
                                href="/profile"
                                startContent={<LuUserSquare2 size={18} />}
                                textValue='Profile'
                            >
                                Profile
                            </DropdownItem>
                        </DropdownSection>
                        <DropdownSection>
                            <DropdownItem
                                key="logout"
                                className='text-red-500'
                                color='danger'
                                startContent={<LuLogOut />}
                                onPress={handleLogout}
                            >Logout
                            </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
                {/* POST Button */}
                <Button
                    color="primary"
                    className="text-base self-center hidden lg:flex"
                    radius="lg"
                    variant='shadow'
                >
                    Post
                    <LuPen />
                </Button>
                <Button color="primary"
                    className="text-base self-center align-middle lg:hidden sm:flex"
                    radius="md"
                    isIconOnly
                    variant='shadow'
                >
                    <LuPen size={20} />
                </Button>
            </div>
        </div>
    )
}

export default Navbar;
