// create-nft.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useNavigate } from 'react-router-dom';

const client = ipfsHttpClient({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});
import { marketplaceAddress } from '../config';

import NFTMarketplace from '../abi/NFTMarketplace.json';

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const navigate = useNavigate();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `http://127.0.0.1:8080/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `http://127.0.0.1:8080/ipfs/${added.path}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
        if (!url) return;

        try {
            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            /* Create the NFT */
            const price = ethers.parseUnits(formInput.price, "ether");
            const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
            let listingPrice = await contract.getListingPrice();
            listingPrice = listingPrice.toString();

            const transaction = await contract.createToken(url, price, { value: listingPrice });
            await transaction.wait();

            navigate("/"); // Redirect to home after listing
        } catch (error) {
            console.error("Transaction failed:", error);
        }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
