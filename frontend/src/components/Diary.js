import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Wrapper } from '@googlemaps/react-wrapper'
import axios from 'axios'
import apiKey from '../config'
import Map from './Map'
import Marker from './Marker'
import AddEntryModal from './AddEntryModal'
import ModifyEntryModal from './ModifyEntryModal'
import {
  setEntries, selectEntryList, selectEntryListDay, clearEntries,
} from '../redux/entrySlice'
import { toIsoString } from './Home'

const { bootstrap } = window

const Diary = () => {
  const navigate = useNavigate()
  const [filled, setFilled] = useState({})
  const [username, setUsername] = useState('')
  const [active, setActive] = useState(-1)
  const [markers, setMarkers] = useState([])
  const entries = useSelector(selectEntryList)
  const day = useSelector(selectEntryListDay)
  const dispatch = useDispatch()

  const getEntries = async () => {
    try {
      const resp = await axios.get(`/entries/get/${day._id}`)
      dispatch(setEntries(resp.data))
    } catch (err) {
      console.log(err)
      alert('Could not load day')
    }
  }

  const checkAuth = async () => {
    try {
      const resp = await axios.get('/authenticated')
      setUsername(resp.data)
    } catch (e) {
      alert('Error, authentification failed.')
    }
  }
  useEffect(() => {
    checkAuth()
    if (!day._id) {
      navigate('/home')
    }
    getEntries()
    return () => dispatch(clearEntries())
  }, [])

  const addMarkerOnClick = e => {
    setFilled({ loc: e.latLng })
    const addModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('newEntry'))
    addModal.show()
  }

  const addMarker = (loc, name) => {
    setFilled({ loc, name })
    const addModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('newEntry'))
    addModal.show()
  }

  const addMarkerToList = marker => {
    setMarkers(old => [marker, ...old])
  }

  const handleDisplayEntry = index => {
    setActive(index)
    const ind = markers.findIndex(m => {
      const lat = m.getPosition().lat()
      const lng = m.getPosition().lng()
      return lat === entries[index].loc.lat && lng === entries[index].loc.lng
    })
    window.google.maps.event.trigger(markers[ind], 'click')
  }

  return (
    <>
      <div className="mt-2 mb-2 d-flex">
        <div className="flex-row flex-grow-1">
          <button className="flex-grow-1 btn" type="button" onClick={() => navigate('/home')}>{'< Back'}</button>
          <h2 className="flex-grow-2">{day.date && day.date.substring(0, 10)}</h2>
        </div>
        <div className="d-flex flex-row">
          <p className="fs-5 my-auto">
            Hi
            {' '}
            {username}
          </p>
        </div>
      </div>
      <div className="row border-top pt-4">
        <div className="col border-end" style={{ minHeight: '500px' }}>
          <Wrapper apiKey={apiKey} libraries={['places']}>
            <Map onClick={addMarkerOnClick} addMarker={addMarker} style={{ flex: 1, height: '100%' }}>
              {entries.map((value, i) => (<Marker key={i} entry={value} addMarker={addMarkerToList} position={value.loc} />))}
            </Map>
          </Wrapper>
        </div>
        <div className="col-4">
          <div>
            <div className="row mb-2 ms-1 me-1">
              <button className="btn btn-success p-3" type="button" data-bs-toggle="modal" data-bs-target="#newEntry">Add New Entry</button>
            </div>
            <div className="row ms-1">
              <div className="list-group">
                {entries.map((entry, index) => (
                  <div key={`${index}-div`} className={`d-flex justify-content-between list-group-item ${active === index && 'active'}`}>
                    <button
                      key={index}
                      className="btn btn-light flex-grow-1 text-start"
                      type="button"
                      onClick={() => handleDisplayEntry(index)}
                    >
                      <b>{new Date(entry.time).toTimeString().substring(0, 5)}</b>
                      {`: ${entry.title}`}
                    </button>
                    <button key={`${index}-edit`} type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editEntry" onClick={() => setActive(index)}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddEntryModal filled={filled} setFilled={setFilled} />
      {entries.at(active) && <ModifyEntryModal active={active} />}
    </>
  )
}

export default Diary
