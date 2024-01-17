import React, { useContext, createContext, useEffect } from "react";
import {
  useAddress,
  useContract,
  useConnect as useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const CONTRACT_ADDRESS = "0x275cCefDd798CA10756230a9412bA9f4d64598cf";

const StateContext = createContext();

const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useMetamask();

  const checkChainId = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("Chain ID:", chainId);
    } else {
      console.error("MetaMask not detected");
    }
  };

  useEffect(() => {
    checkChainId();
  }, []);

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [address, form.title, form.description, form.goal, new Date(form.deadline).getTime(), form.image],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = Array.from({ length: numberOfDonations }, (_, i) => ({
      donator: donations[0][i],
      donation: ethers.utils.formatEther(donations[1][i].toString()),
    }));

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export { StateContextProvider };
