import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import "./mNormalize.css";
import styled from "styled-components";
import axios from 'axios';
import iconArrow from "./assets/icons/icon-arrow.svg";
import iconLocation from "./assets/icons/icon-location.svg";
import iconLoader from "./assets/icons/loader.svg"

const Title = styled.h1`
	margin: 0 auto;
	padding: 2rem;
	font-size: 28px;
	letter-spacing: 1px;
	color: white;
`

const TableInfo = styled.ul`
	position: relative;
	z-index: 20;
	width: 90%;
	max-width: 69rem;
	margin: auto;
	background: white;
	border-radius: 10px;
	padding: 2rem;
	text-align: left;
	display: inline-flex;
	justify-content: space-between;
	list-style: none;
	text-align: left;
	gap: 54px;
	min-height: 9rem;
	li{
		width: calc(100%/4);
		padding-right: 3rem;
	}
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
		padding-top: 18px;
		font-size: 24px;
		font-size: clamp(17px,2.3vw,24px);
		font-weight: bold;
	}
	@media screen and (max-width: 770px) {
		flex-direction: column;
		text-align: center;
		align-items: center;
		max-width: 30rem;
		gap: 20px;
		li{
			width: auto;
		}
		span:last-of-type{
			padding-top:6px;
		}
	}
	@media screen and (max-width: 1300px) {
		li{
			padding-right: 0;
		}
	}
`

const FormInfo = styled.form`
	width: 85%;
	max-width: 35rem;
	margin: 0 auto 51px auto;
	position: relative;
	input{
		padding: 18px 25px;
		border-radius: 10px;
		border: none;
		width: 99%;
		padding-right: 5rem;
		letter-spacing: 1px;
	}
	button{
		border: none;
		background: var(--VeryDarkGray);
		border-radius: 0 10px 10px 0;
		padding: 18px 25px;
		cursor: pointer;
		position: absolute;
		right: 0;
		img{
			vertical-align: middle;
		}
	}
	button:hover{
		opacity: .8;
	}
`
const ErrorMessage = styled.p`
	margin: auto;
	font-size: 20px;
	font-weight: 500;
	display: flex;
    flex-direction: column;
    align-items: center;
	gap: 15px;
	svg{
		transform: scale(1.4);
	}
`

function App() {
	const [info, setInfo] = useState(
		{
			"ip": "192.212.174.101",
			"location": {
				"region": `Broolyn, NY 10001`,
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
		iconUrl: iconLocation,
		iconSize: [40, 50], // size of the icon
		iconAnchor: [23, 0], // point of the icon which will correspond to marker's location
	});

	function getInfo(ip = "192.212.174.101", domain = "") {
		setLoading(true)

		axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_KWi4iJ3mHvSf60uE9YdyDDLUo2owD&ipAddress=${ip}&domain=${domain}`)
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
		const IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
		const DOMAIN_REGEX = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g

		if (IP_REGEX.test(e.target.elements["ip"].value.trim())) return getInfo(e.target.elements['ip'].value.trim());
		if (DOMAIN_REGEX.test(e.target.elements["ip"].value.trim())) return getInfo("", e.target.elements['ip'].value.trim());
		setError("Please enter a valid IP address or domain")
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
					? <img src={iconLoader} width="11" height="14" title="Loading..." style={{ "height": "2.5rem", "margin": "auto" }} />
					: <>
						{error
							? <ErrorMessage>
								<svg fill="#ff4848" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M23 7.444v9.112L16.556 23H7.444L1 16.556V7.444L7.444 1h9.112L23 7.444ZM15.728 3H8.272L3 8.272v7.456L8.272 21h7.456L21 15.728V8.272L15.728 3ZM12 17.998a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-.997-12h2v8h-2v-8Z" /></svg>
								{error || "Oops something is wrong"}
							</ErrorMessage>
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

			<MapContainer key={JSON.stringify([info.location.lat, info.location.lng])} center={[info.location.lat || 0, info.location.lng || 0]} zoom={17.5} id="map">
				<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={[info.location.lat || 0, info.location.lng || 0]} icon={locationIcon}></Marker>
			</MapContainer>
		</>
	)
}

export default App
