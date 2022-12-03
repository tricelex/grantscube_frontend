import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { ProjectFactoryAddress, ProjectFactoryAddressABI } from './constants';

const auth = `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`).toString('base64')}`;
const client = ipfsHttpClient({
  host: 'infura-ipfs.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
const fetchProjectContract = (signerOrProvider) => new ethers.Contract(ProjectFactoryAddress, ProjectFactoryAddressABI, signerOrProvider);

export const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      return alert('Please install MetaMask');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
    console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      return alert('Please install MetaMask');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://grantscube.infura-ipfs.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log(('Error uploading to IPFS', error));
    }
  };

  const createProject = async (formInput, fileUrl, router) => {
    const { goal, deadline, title, description } = formInput;

    if (!goal || !deadline || !title || !description || !fileUrl) return;

    const data = JSON.stringify({ title, description, image: fileUrl });

    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchProjectContract(signer);

    const goalEth = ethers.utils.parseUnits(goal, 'ether');
    const deadlineUnix = new Date(deadline).getTime() / 1000;

    try {
      const added = await client.add(data);
      const metaUrl = `https://grantscube.infura-ipfs.io/ipfs/${added.path}`;

      const transaction = await contract.createProject(goalEth, deadlineUnix, title, metaUrl);

      setIsLoadingProjects(true);
      await transaction.wait();
      router.push('/');
    } catch (error) {
      console.log(('Error uploading to IPFS', error));
    }
  };

  const fetchProjects = async () => {
    setIsLoadingProjects(false);
    const url = 'https://rpc.public.zkevm-test.net/';
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = fetchProjectContract(provider);

    const data = await contract.fetchProjectItems();

    const items = await Promise.all(data.map(async ({ title, goal: unformattedGoal, deadline, creator, totalFunding: unformattedTotalFunding, contributionsCount, contributorsCount, fundingHub, projectAddress, metaUrl }) => {
      const { data: { image, description } } = await axios.get(metaUrl);

      const goal = ethers.utils.formatUnits(unformattedGoal.toString(), 'ether');
      const totalFunding = ethers.utils.formatUnits(unformattedTotalFunding.toString(), 'ether');
      return { title, goal, deadline: deadline.toNumber(), creator, totalFunding, contributionsCount: contributionsCount.toNumber(), contributorsCount: contributorsCount.toNumber(), fundingHub, projectAddress, image, description };
    }));
    return items;
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    setIsLoadingNFT(false);
    return [type];
  };

  const donateToProject = async (project, price) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchProjectContract(signer);
    const donationAmount = ethers.utils.parseUnits(price.toString(), 'ether');

    const transaction = await contract.contribute(project.projectAddress, { value: donationAmount });
    setIsLoadingProjects(true);
    await transaction.wait();
    setIsLoadingProjects(false);
  };

  return (
    <ProjectContext.Provider value={{ nftCurrency, connectWallet, currentAccount, isLoadingNFT, uploadToIPFS, fetchMyNFTsOrListedNFTs, isLoadingProjects, fetchProjects, createProject, donateToProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
