import { useEffect, useState } from 'react';
import "./mNormalize.css";
import styled from "styled-components";
import axios from 'axios';
import iconArrow from "./assets/icons/icon-arrow.svg";

const Title = styled.h1`
	margin: 0 auto;
	padding: 1rem;
	color: white;
`

const TableInfo = styled.ul`
	margin: auto;
	background: white;
	border-radius: 10px;
	padding: 1rem;
	text-align: left;
	display: flex;
	gap: 2rem;
	justify-content: space-around;
	list-style: none;
	text-align: left;
	z-index: 10;
	span{
		display: block;
	}
	span:last-of-type{
		font-size: 20px;
		font-weight: bold;
	}
	@media screen and (max-width: 770px) {
		flex-direction: column;
		text-align: center;
	}
`

const FormInfo = styled.form`
	margin-bottom: 20px;
	input{
		padding: 10px 20px;
		border-radius: 10px 0 0 10px;
		border: none;
	}
	button{
		border: none;
		background: var(--VeryDarkGray);
		border-radius: 0 10px 10px 0;
		padding: 10px 20px;
		cursor: pointer;
	}
	button:hover{
		opacity: .8;
	}
`

function App() {
	const [query, setQuery] = useState("192.212.174.101");
	const [info, setInfo] = useState({ "ip": "", "location": "", "timezone": "", "isp": "" });

	function getInfo(q = "192.212.174.101") {
		setInfo({ "loading": true })

		axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_KWi4iJ3mHvSf60uE9YdyDDLUo2owD&ipAddress=${q}`)
			.then(function (response) {
				setInfo(response.data);
				console.log(response.data)
			})
			.catch(function (error) {
				setInfo({ "error": error.message })
				console.log(error);
			})
		// .then(() => setInfo({ "loading": false }));
	}

	useEffect(() => {
		if (L.DomUtil.get('map') != null) L.DomUtil.get('map')._leaflet_id = null;

		var locationIcon = L.icon({
			iconUrl: 'src/assets/icons/icon-location.svg',
			iconSize: [40, 50], // size of the icon
			iconAnchor: [23, 0], // point of the icon which will correspond to marker's location
		});

		var map = L.map('map').setView([info.location.lat || 43.731567, info.location.lng || 7.414932], 17);
		L.marker([info.location.lat || 43.731567, info.location.lng || 7.414932], { icon: locationIcon }).addTo(map)

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		}).addTo(map);
	}, []);

	function handleSubmit(e) {
		e.preventDefault();
		if (e.target.elements["ip"].value.trim()) getInfo(e.target.elements['ip'].value.trim())
	}

	return (
		<>
			<Title>IP Address Tracker</Title>
			<FormInfo onSubmit={handleSubmit}>
				<input type="text" name='ip' placeholder='Search for any IP address or domain' />
				<button aria-label='Send'><img src={iconArrow} alt="Send" /></button>
			</FormInfo>

			<TableInfo>
				{info.loading
					? <p>Loading</p>
					: <>
						{info.error
							? <p>{info.error || "Oops something is wrong"}</p>
							: <>
								<li><span>IP Address:</span><span>{info.ip || "192.212.174.101"}</span></li>
								<li><span>Location:</span><span>{info.location.region || "Broolyn, NY 10001"}</span></li>
								<li><span>Timezone:</span><span>UTC {info.location.timezone || "-05:00"}</span></li>
								<li><span>ISP:</span><span>{info.isp || "SpaceX Starlink"}</span></li>
							</>
						}
					</>
				}
			</TableInfo>

			<div id="map"></div>
		</>
	)
}

export default App
