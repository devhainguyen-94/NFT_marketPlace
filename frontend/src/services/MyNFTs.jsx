import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { marketplaceAddress } from '../config';
import NFTMarketplace from '../abi/NFTMarketplace.json';

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const navigate = useNavigate();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
      const data = await marketplaceContract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let price = ethers.formatUnits(i.price.toString(), 'ether');

          return {
            price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI,
          };
        })
      );

      setNfts(items);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  }

  function listNFT(nft) {
    navigate(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  }

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" alt="NFT" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;
