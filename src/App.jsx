import { useEffect, useState } from 'react'
import { Search, LocateFixed, Wind, Droplets, Cloud } from 'lucide-react';
import axios from 'axios';
import img1 from "./assets/img1.jpg"

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const config = {
  params: {
    appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
    units: 'metric',
    lang: 'es'
  }
}

const conditionsCodes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804]
}

const icons = {
  thunderstorm: '⛈️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '❄️',
  atmosphere: '🌫️',
  clear: '☀️',
  clouds: '☁️'
}

const iconUrl = 'https://openweathermap.org/img/wn/[icon]@4x.png'

function App() {
  
  const [cityName, setCityName] = useState('')  
  const [coords, setCoords] = useState(null)
  const [weather, setWeather] = useState(null)  
  const [searchValue, setSearchValue] = useState('') 
  const [loading, setLoading] = useState(true)  
  
  useEffect(() => {
    axios.get('https://ipinfo.io/json')
      .then((res) => {
        setCityName(res.data.city)
      })      
  }, []) 
  
  const params = new URLSearchParams(config.params).toString()
 
  useEffect(() => {
      if (!cityName) return
      setLoading(true)
      axios.get(BASE_URL + `?q=${cityName}&` + params)        
        .then((res) => {
          setWeather({
            city: res.data.name,
            country: res.data.sys.country,
            temp: res.data.main.temp,
            humidity: res.data.main.humidity,
            wind_speed: res.data.wind.speed,
            clouds: res.data.clouds.all,
            description: res.data.weather[0].description,
            icon: res.data.weather[0].icon,
            iconCode: res.data.weather[0].id
          })
        })
        .finally(() => setLoading(false))
    }, [cityName])

  useEffect(() => {
      if (!coords) return
      setLoading(true)
      axios.get(BASE_URL + `?lat=${coords.lat}&lon=${coords.lon}&` + params)       
        .then((res) => {
          setWeather({
            city: res.data.name,
            country: res.data.sys.country,
            temp: res.data.main.temp,
            humidity: res.data.main.humidity,
            wind_speed: res.data.wind.speed,
            clouds: res.data.clouds.all,
            description: res.data.weather[0].description,
            icon: res.data.weather[0].icon,
            iconCode: res.data.weather[0].id
          })
        })
        .finally(() => setLoading(false))
    }, [coords])
 
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchValue.trim() === '') return
    setCityName(searchValue)
    setSearchValue('')
  }
  
  const getCoords = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta Geolocalización')
      return
    }
 
    const success = ({ coords }) => {
      setCoords({
        lat: coords.latitude,
        lon: coords.longitude
      })
    }

    const error = (err) => {
      console.log(err)
      alert('No se pudo obtener tu ubicación')
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  if (loading) return (
    <div className='bg-sky-300 min-h-dvh grid place-content-center'>
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 border-4 border-white border-t-sky-500 rounded-full animate-spin"></div>
        <span className="text-sky-700 font-semibold">Cargando...</span>
      </div>
    </div>
  )

  const conditionKeys = Object.keys(conditionsCodes)

  const iconsIndex = conditionKeys.find(k => conditionsCodes[k].includes(weather?.iconCode))
  
  const styles = {
    backgroundImage: `url(${img1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'   
      
  }

  

  return (
    <div  style={styles} className=' min-h-dvh grid place-content-center'>
    
          <div className='bg-white/80  p-5 rounded-2xl shadow-md'>
            <div className='flex items-center gap-2'>
              <form onSubmit={handleSubmit} className='flex items-center gap-2 border border-gray-300 rounded p-2 bg-white'>
                <Search className='size-5 text-gray-500' />
                <input
                  type="text"
                  className='w-full outline-0'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder='Buscar ciudad...'
                />
              </form>
              <button onClick={getCoords} className='group border border-gray-700 rounded p-2.5 cursor-pointer'>
                <LocateFixed className='size-5 text-gray-700  group-hover:text-gray-900 transition-colors duration-300' />
                <span className='hidden'>Geolocalización</span>
              </button>
            </div>
    
            <div className='mt-3 space-y-3'>
              <div className='size-28 bg-rgba- rounded mx-auto flex items-center justify-center' > 
                {/* <img src={iconUrl.replace('[icon]', weather.icon)}
              alt={weather.description} /> */}
              
              <span role='img' className='text-7xl'>
              {icons[iconsIndex]}
            </span>
            </div>
    
              <h2 className='text-6xl font-bold flex items-start justify-center'>
                {weather.temp.toFixed(0)}<span className='text-xl'>°C</span>
              </h2>
              <h3 className='text-2xl font-semibold text-center'>{weather.city}, {weather.country}</h3>
              <p className='text-gray-500 text-center'>{weather.description}</p>
    
              <ul className='flex items-center gap-3 justify-center'>
                <li>
                  <span className='flex items-center gap-1'>
                    <Wind  className='text-sky-700 size-6'/>
                    <span className='text-xs'>
                      {weather.wind_speed} <span>km/h</span>
                      <span className='block'>Viento</span>
                    </span>
                  </span>
                </li>
                <li>
                  <span className='flex items-center gap-1'>
                    <Droplets  className='text-sky-700 size-6'/>                    
                    <span className='text-xs'>
                      {weather.humidity}<span>%</span>
                      <span className='block'>Humedad</span>
                    </span>
                  </span>
                </li>
                <li>
                  <span className='flex items-center gap-1'>
                    <Cloud  className='text-sky-700 size-6'/> 
                    <span className='text-xs'>
                      {weather.clouds}<span>%</span>
                      <span className='block'>Nubes</span>
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className='  text-md text-white/75 text-center' >Weather App, By Fredy Mendez - Academlo</p> 
        </div>
  )
} 

export default App
