import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import "./mNormalize.css";
import styled from "styled-components";
import axios from 'axios';
import iconArrow from "./assets/icons/icon-arrow.svg";

const Title = styled.h1`
	margin: 0 auto;
	padding: 1.5rem;
	font-size: 26px;
	color: white;
`

const TableInfo = styled.ul`
	width: 80%;
	max-width: 45rem;
	margin: auto;
	background: white;
	border-radius: 10px;
	padding: 2rem;
	text-align: left;
	display: inline-flex;
	gap: 2rem;
	justify-content: space-around;
	list-style: none;
	text-align: left;
	z-index: 10;
	span{
		display: block;
		font-weight: 500;
	}
	span:first-of-type{
		text-transform: uppercase;
		letter-spacing: 2px;
		font-size: 13px;
	}
	span:last-of-type{
		padding-top: 10px;
		font-size: 20px;
		font-weight: bold;
	}
	@media screen and (max-width: 770px) {
		flex-direction: column;
		text-align: center;
	}
`

const FormInfo = styled.form`
	width: 70%;
	max-width: 25rem;
	margin: 0 auto 20px auto;
	position: relative;
	input{
		padding: 15px 25px;
		border-radius: 10px;
		border: none;
		width: 99%;
		padding-right: 5rem;
	}
	button{
		border: none;
		background: var(--VeryDarkGray);
		border-radius: 0 10px 10px 0;
		padding: 15px 25px;
		cursor: pointer;
		position: absolute;
		right: 0;
	}
	button:hover{
		opacity: .8;
	}
`

function App() {
	const [info, setInfo] = useState(
		{
			"ip": "192.212.174.101",
			"location": {
				"region": "roolyn, NY 10001",
				"timezone": "-05:00",
				"lat": "43.731567",
				"lng": "7.414932"
			},
			"isp": "SpaceX Starlink"
		}
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	var locationIcon = L.icon({
		iconUrl: 'src/assets/icons/icon-location.svg',
		iconSize: [40, 50], // size of the icon
		iconAnchor: [23, 0], // point of the icon which will correspond to marker's location
	});

	function getInfo(q = "192.212.174.101") {
		setLoading(true)

		axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_KWi4iJ3mHvSf60uE9YdyDDLUo2owD&ipAddress=${q}`)
			.then(function (res) {
				setInfo(res.data);
				console.log(res.data);
			})
			.catch(function (error) {
				setError(error.message)
			})
			.then(() => setLoading(false));
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (e.target.elements["ip"].value.trim()) getInfo(e.target.elements['ip'].value.trim());
	}

	return (
		<>
			<Title>IP Address Tracker</Title>
			<FormInfo onSubmit={handleSubmit}>
				<input type="search" name='ip' placeholder='Search for any IP address or domain' />
				<button aria-label='Send'><img src={iconArrow} alt="Send" /></button>
			</FormInfo>

			<TableInfo>
				{loading
					? <p>Loading</p>
					: <>
						{error
							? <p>{info.error || "Oops something is wrong"}</p>
							: <>
								<li><span>IP Address:</span><span>{info.ip || "---"}</span></li>
								<li><span>Location:</span><span>{info.location.region || "---"}</span></li>
								<li><span>Timezone:</span><span>UTC {info.location.timezone || "---"}</span></li>
								<li><span>ISP:</span><span>{info.isp || "---"}</span></li>
							</>
						}
					</>
				}
			</TableInfo>

			<MapContainer key={JSON.stringify([info.location.lat, info.location.lng])} center={[info.location.lat || 43.731567, info.location.lng || 7.414932]} zoom={16.5} id="map">
				<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={[info.location.lat || 43.731567, info.location.lng || 7.414932]} icon={locationIcon}></Marker>
			</MapContainer>
		</>
	)
}

export default App
