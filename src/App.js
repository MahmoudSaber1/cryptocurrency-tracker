import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Coins from "./Pages/Coins";
import Home from "./Pages/Home";
import Alert from "./Components/Alert";

function App() {
	const useStyles = makeStyles(() => ({
		App: {
			background: "#14161a",
			color: "#fff",
			minHeight: "100vh",
		},
	}));

	const classess = useStyles();

	return (
		<BrowserRouter>
			<div className={classess.App}>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} exact />
					<Route path="/coins/:id" element={<Coins />} />
				</Routes>
			</div>
			<Alert />
		</BrowserRouter>
	);
}

export default App;
