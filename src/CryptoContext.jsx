import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { createContext } from "react";
import { CoinList } from "./config/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  const [user, setUser] = useState(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) setUser(user);
        else setUser(null);
      },
      []
    );
  });
  console.log("User", user);

  const [watchlist, setWatchList] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);

      // It checks if our db is updated or not
      const unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          console.log("WatchListCoin", coin.data().coins);
          setWatchList(coin.data().coins);
        } else {
          console.log("No Items in WatchList");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
