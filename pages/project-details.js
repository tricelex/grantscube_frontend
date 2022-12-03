import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';

import images from '../assets';
import { ProjectContext } from '../context/ProjectContext';
import { shortenAddress } from '../utils/shortenAddress';
import { Loader, Button, Modal, Input } from '../components';

const PaymentBodyCmp = ({ project, price, setPrice, nftCurrency }) => (
  <div className='flex flex-col'>
    <div className='flexBetween'>
      <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Item</p>
      <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Goal</p>
    </div>

    <div className='flexBetweenStart my-5'>
      <div className='flex-1 flexStartCenter'>
        <div className='relative w-28 h-28'>
          <Image src={project.image || images[`nft${project.i}`]} layout='fill' objectFit='cover' />
        </div>
        <div className='flexCenterStart flex-col ml-5'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{shortenAddress(project.projectAddress)}</p>
          <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'>{project.title}</p>
        </div>
      </div>

      <div>
        <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'>{project.goal} <span className='font-semibold'>{nftCurrency}</span></p>
      </div>
    </div>

    <div className='flexBetween mt-5'>
      <Input
        inputType='number'
        title='Price'
        placeholder='Donation Amount'
        handleClick={(e) => setPrice(e.target.value)}
      />
    </div>

    <div className='flexBetween mt-10'>
      <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Total</p>
      <p className='font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal'>{price} <span className='font-semibold'>{nftCurrency}</span></p>
    </div>
  </div>
);

const ProjectDetails = () => {
  const { nftCurrency, isLoadingProjects, donateToProject } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();

  const [price, setPrice] = useState('');

  const [project, setProject] = useState({ title: '', goal: '', deadline: '', creator: '', totalFunding: '', contributionsCount: '', contributorsCount: '', projectAddress: '', projectImage: '', fundingHub: '', descriptioin: '' });

  useEffect(() => {
    if (!router.isReady) return;
    setProject(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  if (isLoading) {
    <div className='flexStart min-h-screen'>
      <Loader />
    </div>;
  }

  const checkout = async () => {
    await donateToProject(project, price);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  const dateObject = new Date(project.deadline * 1000).toLocaleDateString();

  return (
    <div className='relative flex justify-center min-h-screen md:flex-col'>
      <div className='relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1'>
        <div className='relative w-557 h-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300'>
          <Image
            src={project.image || images.nft1}
            objectFit='cover'
            priority='true'
            className='rounded-xl shadow-lg'
            layout='fill'
          />
        </div>
      </div>
      <div className='flex-1 justify-start sm:px-4 p-12 sm:pb-4'>
        <div className='flex flex-row sm:flex-col'>
          <h2 className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl'>{project.desc}</h2>
        </div>
        <div className='mt-10'>
          <p className='font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal'>Creator</p>
          <div className='flex flex-row items-center mt-3'>
            <div className='relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2'>
              <Image src={images.creator1} objectFit='cover' className='rounded-full' />
            </div>
            <p className='font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold'>{shortenAddress(project.creator)}</p>
          </div>
        </div>
        <div className='mt-10 flex flex-col'>
          <div className='w-full border-b border-nft-black-1 dark:border-nft-gray-1 flex-flex-row'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-base mb-2 minlg:text-base font-medium'>Details</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-base font-normal'><span className='font-semibold'>Description: </span> {project.description}</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'> <span className='font-semibold'>Goal: </span>  {project.goal} <span className='font-semibold'>{nftCurrency}</span></p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'> <span className='font-semibold'>Total Contributed: </span>  {project.totalFunding} <span className='font-semibold'>{nftCurrency}</span></p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'> <span className='font-semibold'>Total Contributors: </span>  {project.contributorsCount}</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'> <span className='font-semibold'>Total Contributions: </span>  {project.contributionsCount}</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal'> <span className='font-semibold'>Deadline: </span>  {dateObject} </p>
          </div>
        </div>
        <div className='flex flex-row sm:flex-col mt-10'>
          <Button btnName='Donate Eth' classStyles='mr-5 sm:mb-5 sm:mr-0 rounded-xl' handleClick={() => setPaymentModal(true)} />
        </div>
      </div>

      {paymentModal && (
        <Modal
          header='Check Out'
          body={<PaymentBodyCmp project={project} price={price} setPrice={setPrice} nftCurrency={nftCurrency} />}
          footer={(
            <div className='flex flex-row sm:flex-col'>
              <Button btnName='Check Out' classStyles='mr-5 sm:mb-5 sm:mr-0 rounded-xl' handleClick={checkout} />
              <Button btnName='Cancel' classStyles='rounded-xl' handleClick={() => setPaymentModal(false)} />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}

      {isLoadingProjects && (
        <Modal
          header='Buying NFT...'
          body={(
            <div className='flexCenter flex-col text-center'>
              <div className='relative w-52 h-52'>
                <Loader />
              </div>
            </div>
          )}
        />
      )}

      {successModal && (
        <Modal
          header='Payment Successful'
          body={(
            <div className='flexCenter flex-col text-center' onClick={() => setSuccessModal(false)}>
              <div className='relative w-52 h-52'>
                <Image src={project.image || images[`nft${project.i}`]} objectFit='cover' layout='fill' />
              </div>
              <p className='font-poppins dark:text-white text-nft-black-1 mt-10 text-sm minlg:text-xl font-normal'>You successfully donated to <span className='font-semibold'>{project.title} </span>from <span className='font-semibold'>{shortenAddress(project.projectAddress)}</span></p>
            </div>
          )}
          footer={(
            <div className='flexCenter flex-col'>
              <Button
                btnName='Check it out'
                classStyles='sm:mb-5 sm: mr-0 rounded-xl'
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
