document.addEventListener("DOMContentLoaded", function () {
    const defaultCoords = [45.75, 4.85]; 
    let userCoords = defaultCoords;
    let map;
    let currentMarkers = [];
    let userMarker = null;
    let activeFilter = null;
    const searchInput = document.getElementById('poiSearch');
    const searchResults = document.getElementById('searchResults');
    const categorySelect = document.getElementById('categorySelect');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    const poiFilters = {
        restaurant: {
            query: 'node["amenity"="restaurant"](around:2000,{lat},{lon});',
            icon: '🍽️',
            color: '#e74c3c'
        },
        fast_food: {
            query: 'node["amenity"="fast_food"](around:2000,{lat},{lon});',
            icon: '🍔',
            color: '#e67e22'
        },
        cafe: {
            query: 'node["amenity"="cafe"](around:2000,{lat},{lon});',
            icon: '☕',
            color: '#d35400'
        },
        bar: {
            query: 'node["amenity"="bar"](around:2000,{lat},{lon});node["amenity"="pub"](around:2000,{lat},{lon});node["amenity"="biergarten"](around:2000,{lat},{lon});',
            icon: '🍺',
            color: '#9b59b6'
        },
        hotel: {
            query: 'node["tourism"="hotel"](around:2000,{lat},{lon});',
            icon: '🏨',
            color: '#3498db'
        },
        camping: {
            query: 'node["tourism"="camp_site"](around:2000,{lat},{lon});',
            icon: '🏕️',
            color: '#27ae60'
        },
        hostel: {
            query: 'node["tourism"="hostel"](around:2000,{lat},{lon});node["tourism"="guest_house"](around:2000,{lat},{lon});',
            icon: '🛏️',
            color: '#16a085'
        },
        fuel: {
            query: 'node["amenity"="fuel"](around:2000,{lat},{lon});node["amenity"="charging_station"](around:2000,{lat},{lon});',
            icon: '⛽',
            color: '#f39c12'
        },
        parking: {
            query: 'node["amenity"="parking"](around:2000,{lat},{lon});node["amenity"="parking_entrance"](around:2000,{lat},{lon});node["amenity"="parking_space"](around:2000,{lat},{lon});',
            icon: '🅿️',
            color: '#34495e'
        },
        rest_area: {
            query: 'node["highway"="rest_area"](around:2000,{lat},{lon});node["highway"="services"](around:2000,{lat},{lon});',
            icon: '🛣️',
            color: '#7f8c8d'
        },
        atm: {
            query: 'node["amenity"="atm"](around:2000,{lat},{lon});node["amenity"="bank"](around:2000,{lat},{lon});',
            icon: '🏧',
            color: '#2ecc71'
        },
        pharmacy: {
            query: 'node["amenity"="pharmacy"](around:2000,{lat},{lon});',
            icon: '💊',
            color: '#e74c3c'
        },
        attraction: {
            query: 'node["tourism"="attraction"](around:2000,{lat},{lon});',
            icon: '🎭',
            color: '#1abc9c'
        },
        zoo: {
            query: 'node["tourism"="zoo"](around:2000,{lat},{lon});',
            icon: '🐘',
            color: '#1abc9c'
        },
        museum: {
            query: 'node["tourism"="museum"](around:2000,{lat},{lon});node["tourism"="gallery"](around:2000,{lat},{lon}); node["tourism"="aquarium"](around:2000,{lat},{lon});',    
            icon: '🏛️',
            color: '#8e44ad'
        },
        monument: {
            query: 'node["historic"="monument"](around:2000,{lat},{lon});node["historic"="memorial"](around:2000,{lat},{lon}); node["archaeological_site"="memorial"](around:2000,{lat},{lon}); node["historic"="building"](around:2000,{lat},{lon}); node["historic"="castle"](around:2000,{lat},{lon}); node["historic"="church"](around:2000,{lat},{lon});',
            icon: '🗿',
            color: '#95a5a6'
        },
        viewpoint: {
            query: 'node["tourism"="viewpoint"](around:2000,{lat},{lon});',
            icon: '🌄',
            color: '#f39c12'
        },
        park: {
            query: 'node["leisure"="park"](around:2000,{lat},{lon});node["leisure"="garden"](around:2000,{lat},{lon});',
            icon: '🌳',
            color: '#27ae60'
        },
        beach: {
            query: 'node["natural"="beach"](around:2000,{lat},{lon});',
            icon: '🏖️',
            color: '#3498db'
        },
        supermarket: {
            query: 'node["shop"="supermarket"](around:2000,{lat},{lon});',
            icon: '🛒',
            color: '#e67e22'
        },
        mall: {
            query: 'node["shop"="mall"](around:2000,{lat},{lon});',
            icon: '🏬',
            color: '#9b59b6'
        },
        shop_food: {
            query: 'node["shop"="butcher"](around:2000,{lat},{lon});node["shop"="deli"](around:2000,{lat},{lon});node["shop"="food"](around:2000,{lat},{lon});node["shop"="frozen_food"](around:2000,{lat},{lon});node["shop"="greengrocer"](around:2000,{lat},{lon});node["shop"="water"](around:2000,{lat},{lon});',
            icon: '🛒',
            color: '#21a892ff'
        },
        convenience: {
            query: 'node["shop"="convenience"](around:2000,{lat},{lon});',
            icon: '🏪',
            color: '#16a085'
        },
        hospital: {
            query: 'node["amenity"="hospital"](around:2000,{lat},{lon});node["amenity"="clinic"](around:2000,{lat},{lon});node["amenity"="doctors"](around:2000,{lat},{lon});',
            icon: '🏥',
            color: '#c0392b'
        },
        police: {
            query: 'node["amenity"="police"](around:2000,{lat},{lon});',
            icon: '👮',
            color: '#2c3e50'
        },
        ferrata: {
            query: 'node["highway"="via_ferrata"](around:2000,{lat},{lon});',
            icon: '⛰️',
            color: '#093b11ff'
        },
        rando: {
            query: 'node["highway"="footway"](around:2000,{lat},{lon}); node["highway"="steps"](around:2000,{lat},{lon});node["highway"="path"](around:2000,{lat},{lon});',
            icon: '🥾',
            color: '#5c4404ff'
        }
    };

    const homeFavIcon = L.divIcon({
        html: '<div style="font-size: 24px; color: #f1c40f; text-shadow: 0 0 3px black;">⭐</div>',
        className: 'fav-marker-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });

    function loadHomeFavorites() {
        
        if (typeof currentUserId === 'undefined' || currentUserId === null) return;

        fetch('/fonctions/get_lieux_favoris.php')
            .then(resp => resp.json())
            .then(data => {
                data.forEach(fav => {
                    const lat = parseFloat(fav.latitude);
                    const lon = parseFloat(fav.longitude);
                    
                    const marker = L.marker([lat, lon], { icon: homeFavIcon }).addTo(map);
                    
                    const popupDiv = document.createElement('div');
                    popupDiv.innerHTML = `
                        <b>${fav.nom_lieu}</b><br>
                        <span style="font-size:0.9em; color:#666">${fav.adresse || ''}</span><br>
                        <i style="font-size:0.8em; color:#888">${fav.categorie}</i>
                        <br><br>
                    `;
                    
                    const btnRemove = document.createElement('button');
                    btnRemove.innerText = "❌ Retirer des favoris";
                    btnRemove.style.cssText = "background:#ffeded; color:#c0392b; border:1px solid #c0392b; border-radius:3px; cursor:pointer; font-size:11px; padding:3px 8px;";
                    
                    btnRemove.onclick = function() {
                        if(confirm("Retirer ce lieu de vos favoris ?")) {
                            toggleLieuFavori(btnRemove, fav.nom_lieu, fav.adresse, lat, lon, fav.categorie);
                            
                            setTimeout(() => { map.removeLayer(marker); }, 500); 
                        }
                    };
                    
                    popupDiv.appendChild(btnRemove);
                    marker.bindPopup(popupDiv);
                });
            })
            .catch(e => console.error("Erreur chargement favoris home", e));
    }

    function createCustomIcon(emoji, color) {
        return L.divIcon({
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 18px;">${emoji}</div>`,
            className: 'custom-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    }

    function initializeMap(coords) {
        map = L.map('userMap').setView(coords, 13);

        L.tileLayer('https:
            attribution: '&copy; <a href="https:
            maxZoom: 19
        }).addTo(map);

        addUserMarker(coords);

        map.on('click', function(e) {
            const clickedCoords = [e.latlng.lat, e.latlng.lng];
            updateUserPosition(clickedCoords);
        });

        loadHomeFavorites(); 
    }

    function updateUserPosition(coords) {
        userCoords = coords;
        
        addUserMarker(coords);
        
        map.setView(coords, map.getZoom());
        
        if (activeFilter) {
            loadPOI(activeFilter);
        }
    }

    function addUserMarker(coords) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }

        const userIcon = L.divIcon({
            html: '<div style="background-color: #2ecc71; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
            className: 'user-location-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        userMarker = L.marker(coords, { icon: userIcon }).addTo(map)
            .bindPopup('<b>📍 Votre position</b><br><small>Cliquez sur la carte pour changer de position</small>');
    }

    function tryGeolocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userCoords = [position.coords.latitude, position.coords.longitude];
                    initializeMap(userCoords);
                },
                function(error) {
                    console.log("Géolocalisation refusée ou impossible:", error.message);
                    initMapWithFallback();
                }
            );
        } else {
            initMapWithFallback();
        }
    }

    function initMapWithFallback() {
        const userCity = document.getElementById('userCity').value;
        if (userCity) {
            fetch(`https:
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        userCoords = [lat, lon];
                    }
                    initializeMap(userCoords);
                })
                .catch(() => initializeMap(userCoords));
        } else {
            initializeMap(userCoords);
        }
    }

    tryGeolocation();

    async function loadPOI(filterType) {
        
        clearPOIMarkers();

        showLoadingIndicator();

        const filter = poiFilters[filterType];
        const query = filter.query.replace(/{lat}/g, userCoords[0]).replace(/{lon}/g, userCoords[1]);
        
        const overpassUrl = 'https:
        const overpassQuery = `[out:json][timeout:25];(${query});out body;`;

        try {
            const response = await fetch(overpassUrl, {
                method: 'POST',
                body: overpassQuery
            });

            const data = await response.json();

            data.elements.forEach(element => {
                if (element.lat && element.lon) {
                    const marker = L.marker([element.lat, element.lon], {
                        icon: createCustomIcon(filter.icon, filter.color)
                    }).addTo(map);

                    const name = element.tags.name || 'Sans nom';
                    const address = element.tags['addr:street'] 
                        ? `${element.tags['addr:street']} ${element.tags['addr:housenumber'] || ''}`
                        : 'Adresse non disponible';

                    const popupDiv = document.createElement('div');
                    popupDiv.style.minWidth = "160px";

                    const titleEl = document.createElement('h4');
                    titleEl.style.margin = "0 0 5px 0";
                    titleEl.textContent = `${filter.icon} ${name}`;
                    popupDiv.appendChild(titleEl);

                    const addrEl = document.createElement('p');
                    addrEl.style.margin = "0 0 10px 0";
                    addrEl.style.fontSize = "12px";
                    addrEl.style.color = "#666";
                    addrEl.textContent = address;
                    popupDiv.appendChild(addrEl);

                    if (typeof currentUserId !== 'undefined' && currentUserId !== null) {
                        const favBtn = document.createElement('button');
                        favBtn.innerHTML = '<i class="far fa-star"></i> Favoris'; 
                        favBtn.className = "btn-fav-poi"; 
                        favBtn.style.cssText = "width: 100%; padding: 5px; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px; color: #f39c12; font-weight: bold; transition: all 0.2s;";
                        
                        favBtn.onmouseover = () => { favBtn.style.background = "#fff8e1"; };
                        favBtn.onmouseout = () => { favBtn.style.background = "#fff"; };

                        favBtn.onclick = function() {
                            toggleLieuFavori(favBtn, name, address, element.lat, element.lon, filterType);
                        };

                        popupDiv.appendChild(favBtn);
                    }

                    marker.bindPopup(popupDiv);
                    currentMarkers.push(marker);
                }
            });

            hideLoadingIndicator();

            clearFilterBtn.style.display = 'block';

            if (data.elements.length === 0) {
                alert(`Aucun résultat trouvé dans un rayon de 2km.`);
                clearFilterBtn.style.display = 'none';
            }

        } catch (error) {
            console.error('Erreur lors du chargement des POI:', error);
            hideLoadingIndicator();
            alert('Erreur lors du chargement des données. Veuillez réessayer.');
        }
    }

    function clearPOIMarkers() {
        currentMarkers.forEach(marker => map.removeLayer(marker));
        currentMarkers = [];
    }

    function showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'mapLoader';
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            text-align: center;
        `;
        loader.innerHTML = '<div style="font-size: 24px;">⏳</div><div>Chargement...</div>';
        document.getElementById('userMap').appendChild(loader);
    }

    function hideLoadingIndicator() {
        const loader = document.getElementById('mapLoader');
        if (loader) loader.remove();
    }

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        
        if (selectedCategory) {
            activeFilter = selectedCategory;
            loadPOI(selectedCategory);
        } else {
            
            clearPOIMarkers();
            activeFilter = null;
            clearFilterBtn.style.display = 'none';
        }
    });

    clearFilterBtn.addEventListener('click', function() {
        clearPOIMarkers();
        activeFilter = null;
        categorySelect.value = '';
        this.style.display = 'none';
    });

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        if (query.length > 2) {
            fetch(`https:
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = '';

                    data.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.display_name;
                        li.addEventListener('click', () => {
                            const lat = parseFloat(item.lat);
                            const lon = parseFloat(item.lon);
                            
                            updateUserPosition([lat, lon]);

                            searchResults.innerHTML = '';
                            searchInput.value = '';
                        });
                        searchResults.appendChild(li);
                    });
                })
                .catch(error => console.log('Erreur de recherche : ', error));
        } else {
            searchResults.innerHTML = '';
        }
    });

    document.getElementById('searchBtn').addEventListener('click', function() {
        if (searchInput.value.trim().length > 2) {
            searchInput.dispatchEvent(new Event('input'));
        }
    });

    function toggleLieuFavori(btn, nom, adresse, lat, lon, categorie) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "⏳ ...";
        btn.disabled = true;

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('adresse', adresse);
        formData.append('lat', lat);
        formData.append('lon', lon);
        formData.append('categorie', categorie);

        fetch('/formulaire/fav_lieu.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            btn.disabled = false;
            if (data.success) {
                if (data.action === 'added') {
                    btn.innerHTML = '<i class="fas fa-star"></i> En favoris'; 
                    btn.style.background = "#f39c12";
                    btn.style.color = "white";
                    alert(data.message);
                } else {
                    btn.innerHTML = '<i class="far fa-star"></i> Favoris'; 
                    btn.style.background = "#fff";
                    btn.style.color = "#f39c12";
                    alert(data.message);
                }
            } else {
                btn.innerHTML = originalText;
                alert("Erreur : " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            btn.disabled = false;
            btn.innerHTML = originalText;
            alert("Une erreur est survenue.");
        });
    }
});