import React, { useState, useEffect, useRef } from 'react'
import SearchBox from './SearchBox'

const getCurrentLocation = async () => {
  try {
    const { coords: { latitude, longitude } } = await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej)
    })
    return { lat: latitude, lng: longitude }
  } catch (err) {
    return { lat: 39.9523992604571, lng: -75.19384691112 }
  }
}

const Map = ({
  style, children, onClick, addMarker,
}) => {
  const ref = useRef(null)
  const [map, setMap] = useState()

  useEffect(() => {
    const initMap = async () => {
      const options = {
        zoom: 4,
        center: await getCurrentLocation(),
        mapTypeId: 'roadmap',
      }
      setMap(new window.google.maps.Map(ref.current, options))
    }
    if (ref.current && !map) {
      initMap()
    }
  }, [ref, map])

  useEffect(() => {
    if (map) {
      window.google.maps.event.clearListeners(map, 'click')
      if (onClick) {
        map.addListener('click', onClick)
      }
    }
  }, [map, onClick])

  return (
    <>
      <SearchBox map={map} addMarker={addMarker} />
      <div ref={ref} style={style} />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map })
        }
        return child
      })}
    </>
  )
}

export default Map
