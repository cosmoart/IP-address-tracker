import { useEffect, useState } from 'react';
import "./modernNormalize.css";
// import L from "leaflet"
import styled from "styled-components";
import axios from 'axios';
import iconArrow from "./assets/icons/icon-arrow.svg";

const Title = styled.h1`
	margin: 0 auto;
	padding: 1rem;
	color: white;
`

const TableInfo = styled.table`
	margin: auto;
	background: white;
	border-radius: 10px;
	padding: 1rem;
	text-align: left;

	thead th{
		padding-right: 15px;
		opacity: .8;
	}
	tbody th{
		font-size: 22px;
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
	}
	button:hover{
		opacity: .8;
	}
`

function App() {
	const [query, setQuery] = useState("192.212.174.101");
	const [info, setInfo] = useState({ "ip": "", "location": "", "timezone": "", "isp": "" });
	const [loading, setLoading] = useState();


	function getInfo(q = "8.8.8.8") {
		axios.get(`https://geo.ipify.org/api/v2/country?apiKey=at_KWi4iJ3mHvSf60uE9YdyDDLUo2owD&ipAddress=${q}`)
			.then(function (response) {
				// handle success
				console.log(response.data)
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	useEffect(() => {
		var container = L.DomUtil.get('map');
		if (container != null) {
			container._leaflet_id = null;
		}
		// getInfo(query);
		var locationIcon = L.icon({
			iconUrl: 'src/assets/icons/icon-location.svg',
			iconSize: [46, 56], // size of the icon
			iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
		});

		var map = L.map('map').setView([1.668387, -77.011026], 16);
		L.marker([1.668387, -77.011026], { icon: locationIcon }).addTo(map)
		// var map = L.map('map').setView([51.505, -0.09], 13);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		}).addTo(map);

		// if (map) {
		// 	map = map.off();
		// 	map = map.remove();
		// }
	}, []);

	useEffect(() => {

	}, [query]);

	function handleSubmit(e) {
		e.preventDefault();
		console.log(e.target);
	}

	return (
		<>
			<Title>IP Address Tracker</Title>
			<FormInfo onSubmit={handleSubmit}>
				<input type="text" placeholder='Search for any IP address or domain' />
				<button aria-label='Send'><img src={iconArrow} alt="Send" /></button>
			</FormInfo>

			<TableInfo>
				<thead>
					<tr>
						<th>IP Address:</th>
						<th>Location:</th>
						<th>Timezone:</th>
						<th>ISP:</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>{info.ip}</th>
						<th>{info.location}</th>
						<th>UTC {info.timezone}</th>
						<th>{info.isp}</th>
					</tr>
				</tbody>
			</TableInfo>

			<div id="map"></div>
		</>
	)
}

export default App
