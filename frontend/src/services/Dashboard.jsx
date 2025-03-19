import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { marketplaceAddress } from '../config';
import NFTMarketplace from '../abi/NFTMarketplace.json';

const CreatorDashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
      const data = await contract.fetchItemsListed();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

          return {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
          };
        })
      );

      setNfts(items);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" alt="NFT" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
