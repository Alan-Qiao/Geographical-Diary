import React, { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const Marker = ({
  entry, addMarker, ...options
}) => {
  const [marker, setMarker] = useState()
  const [infoWindow, setInfoWindow] = useState()

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker())
    }
    if (marker) {
      addMarker(marker)
    }

    return () => {
      if (marker) {
        marker.setMap(null)
      }
      if (infoWindow) {
        infoWindow.close()
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  useEffect(() => {
    if (marker && entry) {
      const content = (
        <div className="card-deck">
          <div className="card card-body">
            <h3 className="card-title">{entry.title}</h3>
            <h6 className="card-subtitle mb-2 text-muted">
              Time:
              {' '}
              {new Date(entry.time).toTimeString().substring(0, 5)}
            </h6>
            <h6 className="card-subtitle text-muted">{entry.name || `lat: ${entry.loc.lat} lng: ${entry.loc.lng}`}</h6>
            <hr />
            <p className="card-text fs-6" style={{ whiteSpace: 'pre-wrap' }}>{entry.note}</p>
          </div>
        </div>
      )
      setInfoWindow(new window.google.maps.InfoWindow({ content: renderToStaticMarkup(content) }))
    }
  }, [marker, entry])

  useEffect(() => {
    if (marker && options && options.map && infoWindow) {
      window.google.maps.event.clearListeners(marker, 'click')
      marker.addListener('click', () => {
        infoWindow.open({
          anchor: marker,
          map: options.map,
          shouldFocus: false,
        })
      })
    }
  }, [marker, infoWindow, options])

  return null
}

export default Marker
