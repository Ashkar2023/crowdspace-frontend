import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Switch, User } from '@nextui-org/react';
import React, { useState } from 'react';
import { LuBell, LuCompass, LuFilm, LuHome, LuLogOut, LuMessageCircle, LuPen, LuRadio, LuSearch, LuSettings2, LuSun, LuUsers, LuUserSquare2 } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearUser } from '../services/state/user.slice';
import { userApiProtected } from '../services/api/axios-http';
import { RiMoonFill } from 'react-icons/ri';

const navItems = [
    { href: '/', label: "Home", icon: LuHome },
    { href: '/search', label: "Search", icon: LuSearch },
    { href: '/explore', label: "Explore", icon: LuCompass },
    { href: '/shots', label: "Shots", icon: LuFilm },
    { href: '/communities', label: "Communities", icon: LuUsers },
    { href: '/udpates', label: "Updates", icon: LuBell },
    { href: '/messages', label: "Messages", icon: LuMessageCircle },
    { href: '/openmic', label: "Open mic", icon: LuRadio },
]


export const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [isMoreOpen, setMoreOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const userState = useSelector(state => state.user);

    const handleLogout = async (e) => {
        try {
            await userApiProtected.get("/auth/logout");
            dispatch(clearUser());
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <div className="flex flex-col items-center h-full">
                <div className="flex flex-col h-full w-full px-auto">
                    <div className='flex justify-center my-6'>
                        <img src='/crowdspace-logo-light-theme.svg' className='h-12 w-12' />
                    </div>
                    <nav className="flex flex-col flex-grow overflow-none mx-6 font-semibold space-y-2">
                        {navItems.map(item => (
                            <Link
                                to={item.href}
                                key={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2
                                transition-all hover:bg-gray-200 `
                                    // + `${location.pathname===item.href? "text-gray-900 bg-gray-200":""}`
                                }
                            >
                                <item.icon className='h-5 w-5 ' />
                                {item.label}
                            </Link>
                        ))}

                    </nav>
                    <div className='mx-8 flex mb-4 justify-between gap-2'>

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
                                                isSelected={isSelected}
                                                onValueChange={(bool) => {
                                                    setIsSelected(bool);
                                                }}
                                                classNames={{
                                                    wrapper: ["group-data-[selected=true]:bg-slate-700"]
                                                }}
                                                thumbIcon={isSelected ? <RiMoonFill /> : <LuSun />}
                                            />
                                        }
                                        textValue='DarkMode'
                                    >
                                        Dark mode
                                    </DropdownItem>
                                </DropdownSection>
                                
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={e => navigate("/settings")}
                                        startContent={<LuSettings2 size={18} />}
                                        textValue='Settings'
                                    >
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={e => navigate("/profile")}
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
            </div>
        </>
    )
}

