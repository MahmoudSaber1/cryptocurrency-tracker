import { Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Carousel from "./Carousel";

const Banner = () => {
	const useStyles = makeStyles(() => ({
		banner: {
			backgroundImage: "url(./banner2.jpg)",
		},
		bannerContent: {
			height: 400,
			display: "flex",
			flexDirection: "column",
			paddingTop: 25,
			justifyContent: "space-around",
		},
		tagLine: {
			display: "flex",
			height: "40%",
			flexDirection: "column",
			justifyContent: "center",
			textAlign: "center",
		},
	}));

	const classBanner = useStyles();

	return (
		<div className={classBanner.banner}>
			<Container className={classBanner.bannerContent}>
				<div className={classBanner.tagLine}>
					<Typography
						variant="h2"
						style={{
							fontWeight: "bold",
							marginBottom: 15,
							fontFamily: "Montserret",
						}}
					>
						Crypto Tracker
					</Typography>
					<Typography
						variant="subtitle2"
						style={{
							color: "darkgray",
							textTransform: "capitalize",
							fontFamily: "Montserret",
						}}
					>
						Get all the Info regarding your favorite Crypto Currency
					</Typography>
				</div>
				<Carousel />
			</Container>
		</div>
	);
};

export default Banner;
