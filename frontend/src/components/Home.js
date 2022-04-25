import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addDay, selectDayList, setDays } from '../redux/daySlice'
import { setDay } from '../redux/entrySlice'

export const toIsoString = date => {
  const tzo = -date.getTimezoneOffset()
  const dif = tzo >= 0 ? '+' : '-'
  const pad = num => (num < 10 ? '0' : '') + num

  return `${date.getFullYear()
  }-${pad(date.getMonth() + 1)
  }-${pad(date.getDate())
  }T${pad(date.getHours())
  }:${pad(date.getMinutes())
  }:${pad(date.getSeconds())
  }${dif}${pad(Math.floor(Math.abs(tzo) / 60))
  }:${pad(Math.abs(tzo) % 60)}`
}

const Home = () => {
  const days = useSelector(selectDayList)
  const [newDate, setNewDate] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const checkAuthentication = async () => {
    try {
      const resp = await axios.get('/authenticated')
      if (!resp) {
        navigate('/login')
      }
      setUsername(resp.data)
    } catch (e) {
      alert('Error, authentification failed.')
    }
  }

  const handleLogOut = async () => {
    try {
      await axios.post('/account/logout')
      await checkAuthentication()
      navigate('/login')
    } catch (e) {
      alert('Error, failed to logout.')
    }
  }

  const fetchDays = async () => {
    try {
      const resp = await axios.get('/day/all')
      dispatch(setDays(resp.data))
    } catch (e) {
      alert('An error occured while fetching questions')
    }
  }

  useEffect(() => {
    checkAuthentication()
    fetchDays()
  }, [])

  const handleAdd = async () => {
    try {
      const resp = await axios.post('/day/new', { date: newDate })
      dispatch(addDay(resp.data.data))
    } catch (err) {
      alert('Could not add new day')
    }
  }

  const handleDaySelect = day => {
    dispatch(setDay(day))
    navigate('/diary')
  }

  return (
    <>
      <div className="mt-2 mb-2 d-flex">
        <div className="flex-grow-1">
          <h1>Geo Diary</h1>
        </div>
        <div className="d-flex flex-row">
          <p className="fs-5 my-auto">
            Hi
            {' '}
            {username}
          </p>
          <button className="btn" type="button" onClick={() => handleLogOut()}>Log out</button>
        </div>
      </div>
      <div className="row border-top pt-4">
        <div className="row my-auto mx-auto">
          <div className="form-group d-grid">
            <label className="form-label" htmlFor="newDay">Enter Date for a New Day:</label>
            <input className="form-control" id="newDay" type="date" onChange={e => setNewDate(e.target.value)} value={newDate} />
            <button className="btn btn-primary mt-3" type="button" onClick={() => handleAdd()}>Add Day</button>
          </div>
        </div>
        <div className="row border-top pt-2">
          <div className="list-group">
            {days.map(value => <button key={value.date} type="button" className="list-group-item list-group-item-action" onClick={() => handleDaySelect(value)}>{value.date.substring(0, 10)}</button>)}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
