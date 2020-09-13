const fs = require('fs')
const https = require('https')
const path = require('path')
const jsonSrc = require(path.resolve(__dirname, '../tmp/sponsors.json'))

async function main() {
	const items = jsonSrc.data.user.sponsorshipsAsMaintainer.edges.map((edge) => {
		return edge.node.sponsorEntity
	})

	for (let item of items) {
		if (item.location) {
			// ╮( ˘ ､ ˘ )╭
			if (typeof item.location === 'string' && item.location === 'undefined') {
				item.geoCode = [-30.613889, 83.6625]
				continue
			}

      item.geoCode = await forwardGeocode(item.location)
      console.log(JSON.stringify(item))
		}
	}

	fs.writeFileSync(
		path.resolve(__dirname, '../src/sponsorsWithGeo.ts'),
		`
export interface Sponsor {
  login: string
  name: string | null
  location: string | null
  avatarUrl: string
  geoCode?: [number, number]
}
  
export const sponsorsData: Sponsor[] = ${JSON.stringify(items, null, 2)}`.trim()
	)
}

async function getHttp(url) {
	return new Promise((resolve, reject) => {
		https
			.get(url, { headers: { 'User-Agent': 'get-sponsors' } }, (res) => {
				let rawData = ''
				res.on('data', (chunk) => {
					rawData += chunk
				})
				res.on('end', () => {
					try {
						const parsedData = JSON.parse(rawData)
						resolve(parsedData)
					} catch (e) {
						reject(e)
					}
				})
			})
			.on('error', (e) => {
				reject(e)
			})
	})
}

async function forwardGeocode(location) {
	const reqUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		location
	)}.json?access_token=${process.env.MAPBOX_KEY}`

	const data = await getHttp(reqUrl)

	return data.features[0].center
}

main().then(() => {
	console.log('done')
	process.exit()
})
