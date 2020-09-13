import { Marker } from 'mapbox-gl'
import { sponsorsData } from './sponsorsWithGeo'

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2N0cmVmIiwiYSI6ImNrZXhxaTJ1czBvNmYyem1ndTNydHA3YW8ifQ.Xgj7DkW6zpgZPhiOtcifpg'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/octref/ckejpz9x04ye31apvjnvr0aa1',
  zoom: 1
})

async function main() {
  const idToMarker: { [id: string]: Marker } = {}

  sponsorsData.forEach(async (s) => {
    if (s.location && s.geoCode) {
      const el = document.createElement('div')
      el.classList.add('marker')
      el.style.backgroundImage = `url('${s.avatarUrl}')`
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<a href="https://github.com/${s.login}">${s.login}</a> from ${s.location}`
      )
      const marker = new mapboxgl.Marker(el)
        .setLngLat(s.geoCode)
        .setPopup(popup)
      marker.addTo(map)

      idToMarker[s.location] = marker
    }
  })

  const elSponsorListing = document.getElementById('sponsor-listing')!

  sponsorsData.forEach((s) => {
    const p = document.createElement('p')
    p.innerHTML = `<img src="${s.avatarUrl}" width="14" height="14" />${
      s.name ?? s.login
    } from ${s.location || 'somewhere'}`

    if (s.geoCode) {
      p.onclick = () =>
        map.flyTo({
          center: s.geoCode,
          essential: true,
          zoom: 7.5,
          duration: 2500
        })
    }

    elSponsorListing.appendChild(p)
  })
}

main()
