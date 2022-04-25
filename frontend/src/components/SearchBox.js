import React, { useState, useEffect, useRef } from 'react'

const SearchBox = ({ map, addMarker }) => {
  const ref = useRef(null)
  const [box, setBox] = useState()

  useEffect(() => {
    if (!box) {
      setBox(new window.google.maps.places.SearchBox(ref.current))
    }
  }, [ref, box])

  useEffect(() => {
    if (box && map) {
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(ref.current)
      window.google.maps.event.clearListeners(map, 'bounds_changed')
      map.addListener('bounds_changed', () => {
        box.setBounds(map.getBounds())
      })
      window.google.maps.event.clearListeners(map, 'places_changed')
      box.addListener('places_changed', () => {
        const places = box.getPlaces()
        if (places.length === 0) return
        const [{ name, geometry }] = places
        if (!geometry || !geometry.location) return
        addMarker(geometry.location, name)
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(geometry.location)
        map.fitBounds(bounds)
      })
    }
  }, [box, map])

  return (
    <input ref={ref} className="form-control mt-2" type="text" style={{ width: '500px' }} placeholder="Search for a location..." />
  )
}

export default SearchBox
