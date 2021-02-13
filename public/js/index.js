let geocoder;
let map;
let polyLine;


function initMap() {
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 10,
		center: {
			lat: 53.429173,
			lng: -1.812743
		},
	});

	polyLine = new google.maps.Polyline();
	google.maps.event.addListener(map, 'click', function (event) {
		displayCoordinates(event.latLng);
	});
}

function codeAddress() {
	var address = document.getElementById('postcode').value;
	geocoder.geocode({
		'address': address
	}, function (results, status) {
		if (status == 'OK') {
			map.setCenter(results[0].geometry.location);
			console.log(results[0].geometry.location);
			displayCoordinates(results[0].geometry.location);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function displayCoordinates(pnt) {
	map.setCenter(pnt); // center the map to click
	polyLine.setMap(null); // remove previous boundaries

	let lat = pnt.lat();
	lat = lat.toFixed(4);
	let lng = pnt.lng();
	lng = lng.toFixed(4);

	$.ajax({
		type: 'GET',
		dataType: "json",
		url: "https://data.police.uk/api/locate-neighbourhood?q=" + lat + "," + lng, // get force and neighbourhood of coords
		data: {},
		success: function (data) {
			let force = data.force;
			let neighbourhood = data.neighbourhood;
			$.ajax({
				type: 'GET',
				dataType: "json",
				url: "https://data.police.uk/api/" + data.force + "/" + data.neighbourhood + "/boundary", // get polygon of boundary
				data: {},
				success: function (data) {
					let poly = [];
					for (let index = 0; index < data.length; index++) {
						let coords = {
							"lat": parseFloat(data[index].latitude),
							"lng": parseFloat(data[index].longitude)
						};
						poly.push(coords);
					}
					polyLine = new google.maps.Polygon({
						paths: poly,
						strokeColor: "#FF0000",
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: "#FF0000",
						fillOpacity: 0.35,
					})
					polyLine.setMap(map);
					getForceDetails(force, neighbourhood);
				},
				error: function () {
					console.log('error');
				}
			});
		},
		error: function () {
			console.log('error');
		}
	});


	function getForceDetails(force, neighbourhood) {
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: "https://data.police.uk/api/" + force + "/" + neighbourhood, // get information of force
			data: {},
			success: function (data) {
				getCrime(force);
				document.getElementById("forceName").innerHTML = data.name;
				document.getElementById("forceWebsite").href = data.url_force;
				document.getElementById("forceWebsite").innerHTML = data.url_force;
				document.getElementById("forceEmail").href = data.contact_details.email;
				document.getElementById("forceEmail").innerHTML = data.contact_details.email;
				document.getElementById("forceTelephone").innerHTML = data.contact_details.telephone;
				document.getElementById("forceFacebook").href = data.contact_details.facebook;
				document.getElementById("forceFacebook").innerHTML = data.contact_details.facebook;
				document.getElementById("forceTwitter").href = data.contact_details.twitter;
				document.getElementById("forceTwitter").innerHTML = data.url_force;
			},
			error: function () {
				console.log('error');
			}
		});
	}

	function getCrime(force){
		console.log(force);
		let date = document.getElementById("crimeMonth").value;
		console.log(date);
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: "https://data.police.uk/api/crimes-no-location?category=all-crime&force="+force+"&date="+date,
			data: {},
			success: function (data) {
				document.getElementById("crimeStats").innerHTML = data.length;
				document.getElementById("crimeRegion").innerHTML = force;

			},
			error: function () {
				console.log('error');
			}
		});
	}
}