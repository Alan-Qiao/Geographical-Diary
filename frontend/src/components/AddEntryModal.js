import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { selectEntryListDay, addEntry } from '../redux/entrySlice'
import { toIsoString } from './Home'

const AddEntryModal = ({ filled: { loc, name }, setFilled }) => {
  const dispatch = useDispatch()
  const { _id: dayId, date } = useSelector(selectEntryListDay)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [note, setNote] = useState('')

  useEffect(() => {
    setLat(loc ? loc.lat() : 0)
    setLng(loc ? loc.lng() : 0)
  }, [loc, name])

  const newEntry = async () => {
    try {
      const resp = await axios.post('/entries/add', {
        dayId,
        title,
        time: toIsoString(new Date(date.substring(0, 11) + time)).substring(0, 16),
        loc: { lat, lng },
        name: name || '',
        note,
      })
      dispatch(addEntry(resp.data))
      setFilled({})
    } catch (err) {
      alert('An error occured when adding this entry')
    }
  }

  return (
    <div
      className="modal fade"
      id="newEntry"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Add Entry:</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              data-bs-target="#newEntry"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <label htmlFor="titpleInput" className="form-label">Title</label>
            <input id="titleInput" className="form-control" type="text" onChange={e => setTitle(e.target.value)} value={title} />
            <label htmlFor="timeInput" className="form-label">Title</label>
            <input id="timeInput" className="form-control" type="time" onChange={e => setTime(e.target.value)} value={time} />
            <label htmlFor="latInput" className="form-label">Latitude</label>
            <input id="latInput" className="form-control" type="number" min="-180" max="180" onChange={e => setLat(e.target.value)} value={lat} />
            <label htmlFor="lngInput" className="form-label">Longitude</label>
            <input id="lngInput" className="form-control" type="number" min="-180" max="180" onChange={e => setLng(e.target.value)} value={lng} />
            <label htmlFor="noteInput" className="form-label">Notes</label>
            <textarea id="noteInput" className="form-control" type="text" onChange={e => setNote(e.target.value)} value={note} />
            <button
              className="btn btn-primary mt-2"
              type="button"
              data-bs-dismiss="modal"
              data-bs-target="#newEntry"
              onClick={() => newEntry()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEntryModal
