import React, { useState, useEffect, useCallback } from "react";
import Cookies from "cookies-js";
import axios from "axios";
import { MetaphiModal } from "./MetaphiModal";

const MetaphiWalletButton = ({ email, onWalletConnected, onDisconnect }) => {
  const [show, setShow] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const fetchMetaphiWallet = useCallback(async (jwt) => {
    try {
      const config = { headers: { Authorization: `Bearer ${jwt}` } };
      const response = await axios.get(
        "https://api.metaphi.xyz/v1/wallets",
        config
      );
      const walletId = response.data.user.wallet_id;
      setWalletAddress(response.data.user.address);
      onWalletConnected({
        walletAddress: response.data.user.address,
        walletId,
      });
      console.log("metaphi- wallet details", response.data.user);
    } catch (ex) {
      Cookies.expire("x-metaphi-auth");
    }
  });

  const onClick = () => {
    if (!walletAddress) setShow(true);
    else {
      setWalletAddress(null);
      console.log("metaphi- disconnect");
      Cookies.expire("x-metaphi-auth");
    }
  };

  // Get connected wallet address
  useEffect(() => {
    const jwt = Cookies.get("x-metaphi-auth");
    if (jwt) console.log("metaphi- autoconnect");
    if (jwt) fetchMetaphiWallet(jwt);
  }, []);

  const onWalletConnectedCallback = (jwtToken) => {
    fetchMetaphiWallet(jwtToken);
    onModalClose();
  };

  const onModalClose = () => {
    setShow(false);
  };

  return (
    <React.Fragment>
      <button
        style={{ height: "40px" }}
        className="w-full bg-pink text-white rounded-full p-4 mb-4 text-xl"
        onClick={onClick}
      >
        {walletAddress ? "Disconnect" : "Connect"}
      </button>
      <MetaphiModal
        email={email}
        show={show}
        onClose={onModalClose}
        onConnect={onWalletConnectedCallback}
      />
    </React.Fragment>
  );
};

export { MetaphiWalletButton };
