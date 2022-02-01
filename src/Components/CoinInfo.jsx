import axios from "axios";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import {
	CircularProgress,
	createTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { CryptoState } from "../CryptoContext";

const CoinInfo = ({ coin }) => {
	const [historical, setHistorical] = useState();
	const [days, setDays] = useState(1);
	const [flag, setflag] = useState(false);

	// Get Currency Change And Make Fetch CoinsList Api
	const { currency } = CryptoState();

	const fetchHistoricData = async () => {
		const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
		setflag(true);
		setHistorical(data.prices);
	};

	// useEffect For Get Data From Axios Fetch Api On Every Change Currency
	useEffect(() => {
		fetchHistoricData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency, days]);

	const darkTheme = createTheme({
		palette: {
			primary: {
				main: "#fff",
			},
			type: "dark",
		},
	});

	const useStyles = makeStyles((theme) => ({
		container: {
			width: "75%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			marginTop: 25,
			padding: 40,
			[theme.breakpoints.down("md")]: {
				width: "100%",
				marginTop: 0,
				padding: 20,
				paddingTop: 0,
			},
		},
	}));
	const classesInfo = useStyles();

	// Charts Info
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	return (
		<ThemeProvider theme={darkTheme}>
			<div className={classesInfo.container}>
				{!historical | (flag === false) ? (
					<CircularProgress
						style={{ color: "gold" }}
						size={250}
						thickness={1}
					/>
				) : (
					<>
						<Line
							data={{
								labels: historical.map((coin) => {
									let date = new Date(coin[0]);
									let time =
										date.getHours() > 12
											? `${date.getHours() - 12}:${date.getMinutes()} PM`
											: `${date.getHours()}:${date.getMinutes()} AM`;
									return days === 1 ? time : date.toLocaleDateString();
								}),

								datasets: [
									{
										data: historical.map((coin) => coin[1]),
										label: `Price ( Past ${days} Days ) in ${currency}`,
										borderColor: "#EEBC1D",
									},
								],
							}}
							options={{
								elements: {
									point: {
										radius: 1,
									},
								},
							}}
						/>
						<div
							style={{
								display: "flex",
								marginTop: 20,
								justifyContent: "space-around",
								width: "100%",
							}}
						>
							{chartDays.map((day) => (
								<SelectButton
									key={day.value}
									onClick={() => {
										setDays(day.value);
										setflag(false);
									}}
									selected={day.value === days}
								>
									{day.label}
								</SelectButton>
							))}
						</div>
					</>
				)}
			</div>
		</ThemeProvider>
	);
};

export default CoinInfo;
