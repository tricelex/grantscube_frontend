import React, { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/legacy/image';
import { useTheme } from 'next-themes';

import images from '../assets';
import { Banner, CreatorCard, Loader, ProjectCard, SearchBar } from '../components';
import { ProjectContext } from '../context/ProjectContext';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [isLoading, setIsLoading] = useState(true);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { theme } = useTheme();
  const { fetchProjects } = useContext(ProjectContext);

  const [projects, setProjects] = useState([]);
  const [projectsCopy, setProjectsCopy] = useState([]);

  useEffect(() => {
    fetchProjects()
      .then((items) => {
        setProjects(items);
        setProjectsCopy(items);
        setIsLoading(false);
      });
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  }, []);

  useEffect(() => {
    const sortedProjects = [...projects];

    switch (activeSelect) {
      case 'Price (low to high)':
        setProjects(sortedProjects.sort((a, b) => a.goal - b.goal));
        break;
      case 'Price (high to low)':
        setProjects(sortedProjects.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setProjects(sortedProjects.sort((a, b) => b.goal - a.goal));
        break;
      default:
        setProjects(projects);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredProjects = projects.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()));

    if (filteredProjects.length) {
      setProjects(filteredProjects);
    } else {
      setProjects(projectsCopy);
    }
  };

  const onClearSearch = () => {
    if (projects.length && projectsCopy.length) {
      setProjects(projectsCopy);
    }
  };

  const topCreators = getCreators(projectsCopy);

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-full minmd:w-4/5'>
        <Banner
          name='Discover and Fund Amazing Web3 Projects'
          childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left'
          parentStyles='justifyStart mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl'
        />
        {!isLoading && !projects.length ? (
          <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>That&apos;s wierd... Projects to fund!</h1>
        ) : isLoading ? <Loader /> : (
          <>
            <div className=''>
              <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>Top Creators</h1>
              <div ref={parentRef} className='relative flex-1 max-w-full flex mt-3'>
                <div ref={scrollRef} className='flex flex-row w-max overflow-x-scroll no-scrollbar select-none'>
                  {topCreators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImg={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                    />
                  ))}
                  {!hideButtons && (
                  <>
                    <div onClick={() => handleScroll('left')} className='absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 left-0 cursor-pointer'>
                      <Image src={images.left} layout='fill' objectFit='contain' alt='leftArrow' className={theme === 'light' ? 'filter invert' : ''} />
                    </div>
                    <div onClick={() => handleScroll('right')} className='absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 right-0 cursor-pointer'>
                      <Image src={images.right} layout='fill' objectFit='contain' alt='leftArrow' className={theme === 'light' ? 'filter invert' : ''} />
                    </div>
                  </>
                  )}
                </div>
              </div>
            </div>
            <div className='mt-10'>
              <div className='flexBetween mx-4 sm:mx-0 minlg:mx-8 sm:flex-col sm:items-start'>
                <h1 className='flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4'>Hot Projects</h1>
                <div className='flex-2 sm:w-full flex flex-row sm:flex-col'>
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
                {projects.map((project, index) => <ProjectCard key={index} project={project} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
