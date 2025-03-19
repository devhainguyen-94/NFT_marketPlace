import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import NFTMarketplace from "../abi/NFTMarketplace.json";
import { marketplaceAddress } from "../config";

export default function ResellNFT() {
    const [formInput, updateFormInput] = useState({ price: "", image: "" });
    const navigate = useNavigate(); // Replaces useRouter
    const [searchParams] = useSearchParams(); // Get URL params
    const id = searchParams.get("id");
    const tokenURI = searchParams.get("tokenURI");

    useEffect(() => {
        if (tokenURI) fetchNFT();
    }, [tokenURI]);

    async function fetchNFT() {
        try {
            const meta = await axios.get(tokenURI);
            updateFormInput((state) => ({ ...state, image: meta.data.image }));
        } catch (error) {
            console.error("Error fetching NFT metadata:", error);
        }
    }

    async function listNFTForSale() {
        if (!formInput.price) return;

        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(connection);
            const signer = await provider.getSigner();

            const priceFormatted = ethers.parseUnits(formInput.price, "ether");
            const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);
            let listingPrice = await contract.getListingPrice();
            listingPrice = listingPrice.toString();

            const transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice });
            await transaction.wait();

            navigate("/");
        } catch (error) {
            console.error("Error listing NFT:", error);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
                />
                {formInput.image && <img className="rounded mt-4" width="350" src={formInput.image} alt="NFT" />}
                <button
                    onClick={listNFTForSale}
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                >
                    List NFT
                </button>
            </div>
        </div>
    );
}
