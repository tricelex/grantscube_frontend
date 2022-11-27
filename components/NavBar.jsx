import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';
import Button from './Button';

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0: return '/';
      case 1: return '/created-projects';
      case 2: return '/my-projects';
      default: return '/';
    }
  };
  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {['Explore Projects', 'My Projects', 'My NFTs'].map((item, index) => (
        <li key={index} onClick={() => { setActive(item); }} className={`flex flex-row items-center mx-3 text-base font-semibold font-poppins dark:hover:text-white hover:text-nft-dark ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}>
          <Link href={generateLink(index)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

const ButtonGroup = ({ setActive, router }) => {
  const hasConnected = true;
  return hasConnected ? (
    <Button
      btnName='Create'
      classStyles='mx-2 rounded-xl'
      handleClick={() => {
        setActive('');
        router.push('/create-project');
      }}
    />
  ) : <Button btnName='Connect' classStyles='mx-2 rounded-xl' handleClick={() => {}} />;
};

const NavBar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Explore Projects');
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className='flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1'>
      <div className='flex flex-row justify-start flex-1'>
        <Link href='/'>
          <div
            className='cursor-pointer flexCenter md:hidden'
            onClick={() => {}}
          >
            <Image
              src={images.logo02}
              // objectFit='contain'
              alt='logo'
              width={32}
              height={32}
              className='ml-1 text-lg font-semibold dark:text-white text-nft-black-1'
            />
            <p className='text-lg font-semibold dark:text-white text-nft-black-1'>
              GrantsCube
            </p>
          </div>
        </Link>
        <Link href='/'>
          <div
            className='hidden md:flex'
            onClick={() => {}}
          >
            <Image
              src={images.logo02}
              // objectFit='contain'
              alt='logo'
              width={32}
              height={32}
            />
          </div>
        </Link>
      </div>

      <div className='flex flex-row justify-end flex-initial'>
        <div className='flex items-center mr-2'>
          <input type='checkbox' className='checkbox' id='checkbox' onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <label htmlFor='checkbox' className='relative w-8 h-4 p-1 bg-black flexBetween rounded-2xl label'>
            <i className='fas fa-sun' />
            <i className='fas fa-moon' />
            <div className='absolute w-3 h-3 bg-white rounded-full ball' />
          </label>
        </div>

        <div className='flex md:hidden'>
          <MenuItems active={active} setActive={setActive} />
          <div className='ml-4'>
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
      </div>

      <div className='hidden md:flex ml-2'>
        {isOpen ? (
          <Image alt='close' src={images.cross} objectFit='contain' width={20} height={20} onClick={() => setIsOpen(false)} className={theme === 'light' && 'filter invert'} />
        ) : <Image alt='menu' src={images.menu} objectFit='contain' width={25} height={25} onClick={() => setIsOpen(true)} className={theme === 'light' && 'filter invert'} />}

        {isOpen && (
          <div className='fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col'>
            <div className='flex-1 p-4'>
              <MenuItems active={active} setActive={setActive} isMobile />
            </div>
            <div className='p-4 border-t dark:border-nft-black-1 border-nft-gray-1'>
              <ButtonGroup setActive={setActive} router={router} />
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default NavBar;
