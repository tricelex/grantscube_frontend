import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/legacy/image';

import { ProjectContext } from '../context/ProjectContext';
import images from '../assets';
import { Loader, Banner } from '../components';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(ProjectContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSelect] = useState('Recently added');

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchMyNFTs')
      .then(() => {
        setIsLoading(true);
      });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  if (isLoading) {
    <div className='flexStart min-h-screen'>
      <Loader />
    </div>;
  }

  return (
    <div className='w-full flex justify-start items-center flex-col min-h-screen'>
      <div className='w-full flexCenter flex-col'>
        <Banner
          name='Your GrantsCube NFTs'
          childStyles='text-center mt-4'
          parentStyles='h-80 justify-center'
        />
        <div className='flexCenter flex-col z-0 -mt-20'>
          <div className='flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-1 rounded-full'>
            <Image src={images.creator1} className='rounded-full object-cover' objectFit='cover' />
          </div>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6'>{shortenAddress(currentAccount)}</p>
        </div>
      </div>
      {isLoading ? (
        <div className='flexCenter p-16 sm:p-4'>
          <h1 className='font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl'>No Contribution NFTs Owned Yet</h1>
        </div>
      ) : ''}
    </div>
  );
};

export default MyNFTs;
