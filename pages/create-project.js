import React, { useState, useMemo, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/legacy/image';

import { Button, Input, Loader } from '../components';
import { ProjectContext } from '../context/ProjectContext';
import images from '../assets';

const CreateProject = () => {
  const { uploadToIPFS, isLoadingProjects, createProject } = useContext(ProjectContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ title: '', goal: '', deadline: '' });
  const { theme } = useTheme();
  const router = useRouter();

  if (isLoadingProjects) {
    <div className='flexStart min-h-screen'>
      <Loader />
    </div>;
  }

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed ${isDragActive && 'border-file-active'} ${isDragAccept && 'border-file-accept'} ${isDragReject && 'border-file-reject'}`
  ), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-3/5 md:w-full'>
        <h1 className='flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4'>Create new Project</h1>
        <div className='mt-16'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>Upload File</p>
          <div className='mt-4'>
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className='flexCenter flex-col text-center'>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>JPG, PNG, GIF, SVG, WEBM Max 100mb.</p>
                <div className='my-12 w-full flex justify-center'>
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit='contain'
                    alt='file upload'
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm'>Drag and Drop File</p>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm'>or Browse media on your device</p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt='asset_file' />
                </div>
              </aside>
            )}
          </div>
        </div>
        <Input
          inputType='input'
          title='Title'
          placeholder='Project Title'
          handleClick={(e) => setFormInput({ ...formInput, title: e.target.value })}
        />
        <Input
          inputType='textarea'
          title='Description'
          placeholder='Project Description'
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input
          inputType='number'
          title='Goal'
          placeholder='Project Goal'
          handleClick={(e) => setFormInput({ ...formInput, goal: e.target.value })}
        />
        <Input
          inputType='date'
          title='Deadline'
          placeholder='Project Deadline'
          handleClick={(e) => setFormInput({ ...formInput, deadline: e.target.value })}
        />
        <div className='mt-10 w-full flex justify-center'>
          <Button
            btnName='Create Project'
            classStyles='rounded-xl'
            handleClick={() => createProject(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
