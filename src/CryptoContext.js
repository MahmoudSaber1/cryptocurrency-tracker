import axios from "axios";
import React, { useEffect, useState, useContext, createContext } from "react";
import { CoinList } from "./config/api";
import { onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
	const [currency, setCurrency] = useState("EUR");
	const [symbol, setSymbol] = useState("€");
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [alert, setAlert] = useState({
		open: false,
		message: "",
		type: "success",
	});
	const [watchlist, setWatchlist] = useState([]);

	const fetchCoins = async () => {
		setLoading(true);
		const { data } = await axios.get(CoinList(currency));
		setCoins(data);
		setLoading(false);
	};

	useEffect(() => {
		if (currency === "EUR") setSymbol("€");
		else if (currency === "USD") setSymbol("$");
		else if (currency === "INR") setSymbol("₹");
	}, [currency]);

	useEffect(() => {
		if (user) {
			const coinRef = doc(db, "watchlist", user?.uid);
			var unsubscribe = onSnapshot(coinRef, (coin) => {
				if (coin.exists()) {
					console.log(coin.data().coins);
					setWatchlist(coin.data().coins);
				} else {
					console.log("No Items in Watchlist");
				}
			});

			return () => {
				unsubscribe();
			};
		}
	}, [user]);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) setUser(user);
			else setUser(null);
		});
	}, []);

	return (
		<Crypto.Provider
			value={{
				currency,
				symbol,
				setCurrency,
				user,
				coins,
				loading,
				fetchCoins,
				alert,
				setAlert,
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
