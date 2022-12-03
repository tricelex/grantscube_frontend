import projectFactory from './ProjectFactory.json';
import grantsCubeNFTFactory from './GrantsCubeNFTFactory.json';

export const ProjectFactoryAddress = process.env.NEXT_PUBLIC_PROJECT_FACTORY_ADDRESS;
export const ProjectFactoryAddressABI = projectFactory.abi;

export const GrantsCubeNFTFactoryAddress = process.env.NEXT_GRANTS_CUBE_NFT_FACTORY_ADDRESS;
export const GrantsCubeNFTFactoryABI = grantsCubeNFTFactory.abi;

