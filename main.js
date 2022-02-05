var mymap;

var myIcon = L.icon({
    iconUrl : 'assets/icon-location.svg',
    iconSize: [48, 60],
    iconAnchor : [24, 60]
});

var marker;

console.log("coucou")

function findIp() {

    var regex = new RegExp("([0-9]{1,3}\.){3}[0-9]{1,3}");
    var adress = document.getElementById("searchIPinput").value;
    var parameter;
    if (regex.test(adress) == false){
        parameter = "domain=";
    } else {
        parameter = "ipAddress=";
    }

    var searchIP = new Promise (function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (request.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    resolve(response);
                } else {
                    reject(Error("Problème de requête"));
                }
            }
        }
        request.open("GET","https://geo.ipify.org/api/v1?apiKey=at_73plP5spiu1maAq7wHypKKlnBRtaa&" + parameter + adress);
        request.send();
    });
    searchIP.then(function(response){
        mymap.setView([response.location.lat, response.location.lng], 13);
        marker.setLatLng([response.location.lat, response.location.lng]);

        document.getElementById("ipAdress").innerHTML = response.ip;
        document.getElementById("ipLocation").innerHTML = response.location.city + ", " + response.location.region;
        document.getElementById("ipTime").innerHTML = "UTC" + response.location.timezone;
        document.getElementById("ipISP").innerHTML = response.isp;
    })
}

function initialIP() {
    var searchIP = new Promise (function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (request.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    resolve(response);
                } else {
                    reject(Error("Problème de requête"));
                }
            }
        }
        request.open("GET","https://geo.ipify.org/api/v1?apiKey=at_73plP5spiu1maAq7wHypKKlnBRtaa&");
        request.send();
    });
    searchIP.then(function(response){
        mymap = L.map('map').setView([response.location.lat, response.location.lng], 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYXhlbGtubCIsImEiOiJja3A1YzI4ejcyZjYyMnltY2owYmt2ZXpzIn0.U6vOAtEuytdXXiFTqaV8Rg'
        }).addTo(mymap);

        marker = L.marker([48.744481, 2.503562], {icon : myIcon}).addTo(mymap);

        marker.setLatLng([response.location.lat, response.location.lng]);

        document.getElementById("ipAdress").innerHTML = response.ip;
        document.getElementById("ipLocation").innerHTML = response.location.city + ", " + response.location.region;
        document.getElementById("ipTime").innerHTML = "UTC" + response.location.timezone;
        document.getElementById("ipISP").innerHTML = response.isp;
    })
}

document.onload = initialIP();