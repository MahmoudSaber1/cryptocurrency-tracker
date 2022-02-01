/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api";
import HTMLReactParser from "html-react-parser";
import {
	Button,
	LinearProgress,
	makeStyles,
	Typography,
} from "@material-ui/core";
import CoinInfo from "../Components/CoinInfo";
import { numberWithCommas } from "../Components/CoinsTable";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Coins = () => {
	const { id } = useParams();

	const [coin, setCoin] = useState();

	// Get Currency Change And Make Fetch CoinsList Api
	const { currency, symbol, user, setAlert, watchlist } = CryptoState();
	const fetchCoins = async () => {
		const { data } = await axios.get(SingleCoin(id));
		setCoin(data);
	};

	const inWatchlist = watchlist.includes(coin?.id);

	const addToWatchlist = async () => {
		const coinRef = doc(db, "watchlist", user.uid);
		try {
			await setDoc(
				coinRef,
				{ coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
				{ merge: true }
			);

			setAlert({
				open: true,
				message: `${coin.name} Added to the Watchlist !`,
				type: "success",
			});
		} catch (error) {
			setAlert({
				open: true,
				message: error.message,
				type: "error",
			});
		}
	};

	const removeFromWatchlist = async () => {
		const coinRef = doc(db, "watchlist", user.uid);
		try {
			await setDoc(
				coinRef,
				{ coins: watchlist.filter((wish) => wish !== coin?.id) },
				{ merge: true }
			);

			setAlert({
				open: true,
				message: `${coin.name} Removed from the Watchlist !`,
				type: "success",
			});
		} catch (error) {
			setAlert({
				open: true,
				message: error.message,
				type: "error",
			});
		}
	};

	// useEffect For Get Data From Axios Fetch Api On Every Change Currency
	useEffect(() => {
		fetchCoins();
	}, [currency]);

	const useStyles = makeStyles((theme) => ({
		container: {
			display: "flex",
			[theme.breakpoints.down("md")]: {
				flexDirection: "column",
				alignItems: "center",
			},
		},
		sidebar: {
			width: "30%",
			[theme.breakpoints.down("md")]: {
				width: "100%",
			},
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			marginTop: 25,
			borderRight: "2px solid grey",
		},
		heading: {
			fontWeight: "bold",
			marginBottom: 20,
			fontFamily: "Montserrat",
		},
		description: {
			width: "100%",
			fontFamily: "Montserrat",
			padding: 25,
			paddingBottom: 15,
			paddingTop: 0,
			textAlign: "justify",
		},
		marketData: {
			alignSelf: "start",
			padding: 25,
			paddingTop: 10,
			width: "100%",
			[theme.breakpoints.down("md")]: {
				display: "flex",
				justifyContent: "space-around",
			},
			[theme.breakpoints.down("sm")]: {
				flexDirection: "column",
				alignItems: "center",
			},
			[theme.breakpoints.down("xs")]: {
				alignItems: "start",
			},
		},
	}));

	const classesCoins = useStyles();
	if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

	return (
		<div className={classesCoins.container}>
			<div className={classesCoins.sidebar}>
				<img
					src={coin?.image.large}
					alt={coin?.name}
					height="200"
					style={{ marginBottom: 20 }}
				/>
				<Typography variant="h3" className={classesCoins.heading}>
					{coin?.name}
				</Typography>
				<Typography variant="subtitle1" className={classesCoins.description}>
					{HTMLReactParser(coin?.description.en.split(". ")[0])}.
				</Typography>
				<div className={classesCoins.marketData}>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classesCoins.heading}>
							Rank:
						</Typography>
						&nbsp; &nbsp;
						<Typography
							variant="h5"
							style={{
								fontFamily: "Montserrat",
							}}
						>
							{numberWithCommas(coin?.market_cap_rank)}
						</Typography>
					</span>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classesCoins.heading}>
							Current Price:
						</Typography>
						&nbsp; &nbsp;
						<Typography
							variant="h5"
							style={{
								fontFamily: "Montserrat",
							}}
						>
							{symbol}{" "}
							{numberWithCommas(
								coin?.market_data.current_price[currency.toLowerCase()]
							)}
						</Typography>
					</span>
					<span style={{ display: "flex" }}>
						<Typography variant="h5" className={classesCoins.heading}>
							Market Cap:
						</Typography>
						&nbsp; &nbsp;
						<Typography
							variant="h5"
							style={{
								fontFamily: "Montserrat",
							}}
						>
							{symbol}{" "}
							{numberWithCommas(
								coin?.market_data.market_cap[currency.toLowerCase()]
									.toString()
									.slice(0, -6)
							)}
							M
						</Typography>
					</span>
					{user && (
						<Button
							variant="outlined"
							style={{
								width: "100%",
								height: 40,
								backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
							}}
							onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
						>
							{inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
						</Button>
					)}
				</div>
			</div>
			<CoinInfo coin={coin} />
		</div>
	);
};

export default Coins;
