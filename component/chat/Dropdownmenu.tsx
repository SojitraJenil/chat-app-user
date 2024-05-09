import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BsWater } from 'react-icons/bs';
import { TbLogout } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { IoMdRefresh } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { MdDownloadDone, MdOutlineWallpaper } from 'react-icons/md';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
interface Props {
  handleInstallButtonClick: () => void;
  logout: () => void;
  ShowSearch: () => void;
}

export default function Dropdownmenu({ShowSearch, handleInstallButtonClick, logout }: Props) {

  const handleClickDownload = () => {
    handleInstallButtonClick();
  };
  const handleLogout = () => {
    logout()
  };
  const SetShowSearch = () => {
    ShowSearch()
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <BsWater className='text-2xl text-white font-bold mt-1' />
          {/* <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[160px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                  onClick={() => window.location.reload()}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <div className="flex">  <IoMdRefresh className='text-lg me-2' />
                    Refresh</div>
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={handleClickDownload}
                >
                  <div className="flex">  <MdDownloadDone className='text-lg me-2' />
                    Download</div>
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={handleClickDownload}
                >
                  <div className="flex">  <MdOutlineWallpaper className='text-lg me-2' />
                    Wallpaper</div>
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <div className="flex">  <CgProfile className='text-lg me-2' />
                    Profile</div>
                </p>

              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                onClick={SetShowSearch}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <div className="flex">  <IoSearch className='text-lg me-2' />
                    Search</div>
                </p>

              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <p
                  onClick={handleLogout}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <div className="flex">  <TbLogout className='text-lg me-2' />
                    Logout</div>
                </p>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
