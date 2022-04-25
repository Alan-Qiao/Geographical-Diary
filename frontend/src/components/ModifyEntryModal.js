import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { selectEntryList, selectEntryListDay, setEntries } from '../redux/entrySlice'
import { toIsoString } from './Home'

const ModifyEntryModal = ({ active }) => {
  const dispatch = useDispatch()
  const { _id: dayId, date } = useSelector(selectEntryListDay)
  const entries = useSelector(selectEntryList)
  const {
    _id, title, time, loc, name, note,
  } = entries.at(active)
  const [inputTitle, setInputTitle] = useState('')
  const [inputTime, setInputTime] = useState('')
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [inputNote, setInputNote] = useState('')

  useEffect(() => {
    setInputTitle(title || '')
    setLat(loc ? loc.lat : 0)
    setLng(loc ? loc.lng : 0)
    setInputTime(time ? new Date(time).toTimeString().substring(0, 5) : '')
    setInputNote(note || '')
  }, [active])

  const editEntry = async () => {
    try {
      const resp = await axios.post('/entries/modify', {
        dayId,
        entryId: _id,
        title: inputTitle,
        time: toIsoString(new Date(date.substring(0, 11) + inputTime)).substring(0, 16),
        loc: { lat, lng },
        name: name || '',
        note: inputNote,
      })
      const newEntries = entries.map((entry, index) => {
        if (index === active) {
          return resp.data
        }
        return { ...entry }
      })
      dispatch(setEntries(newEntries))
    } catch (err) {
      alert('An error occured when modifying this entry')
    }
  }

  const deleteEntry = async () => {
    try {
      await axios.post('/entries/delete', { dayId, entryId: _id })
      const newEntries = entries.filter((entry, index) => index !== active)
      dispatch(setEntries(newEntries))
    } catch (err) {
      alert('Could not delete this entry')
    }
  }

  return (
    <div
      className="modal fade"
      id="editEntry"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Edit Entry:</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              data-bs-target="#editEntry"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <label htmlFor="titpleInput" className="form-label">Title</label>
            <input id="titleInput" className="form-control" type="text" onChange={e => setInputTitle(e.target.value)} value={inputTitle} />
            <label htmlFor="timeInput" className="form-label">Time</label>
            <input id="timeInput" className="form-control" type="time" onChange={e => setInputTime(e.target.value)} value={inputTime} />
            <label htmlFor="latInput" className="form-label">Latitude</label>
            <input id="latInput" className="form-control" type="number" min="-180" max="180" onChange={e => setLat(e.target.value)} value={lat} />
            <label htmlFor="lngInput" className="form-label">Longitude</label>
            <input id="lngInput" className="form-control" type="number" min="-180" max="180" onChange={e => setLng(e.target.value)} value={lng} />
            <label htmlFor="noteInput" className="form-label">Notes</label>
            <textarea id="noteInput" className="form-control" type="text" onChange={e => setInputNote(e.target.value)} value={inputNote} />
            <div className="row">
              <button
                className="btn btn-primary mt-2"
                type="button"
                data-bs-dismiss="modal"
                data-bs-target="#editEntry"
                onClick={() => editEntry()}
              >
                Submit
              </button>
              <button
                className="btn btn-danger mt-2"
                type="button"
                data-bs-dismiss="modal"
                data-bs-target="#editEntry"
                onClick={() => deleteEntry()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModifyEntryModal
