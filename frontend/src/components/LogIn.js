import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const LogIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const loginUser = async () => {
    try {
      const resp = await axios.post('/account/login', { username, password })
      navigate('/home')
    } catch (e) {
      alert('Login failed, Please check that you entered the correct username and password.')
      console.log(e.response.message)
    }
  }

  return (
    <>
      <h1 className="mt-4 mb-4">Log In</h1>
      <div className="col-4">
        <div className="form-group mt-4">
          <label className="form-label" htmlFor="username">Username:</label>
          <input className="form-control" id="username" type="text" onChange={e => setUsername(e.target.value)} value={username} />
        </div>
        <div className="form-group mt-4">
          <label className="form-label" htmlFor="password">Password:</label>
          <input className="form-control" id="password" type="password" onChange={e => setPassword(e.target.value)} value={password} />
        </div>
        <div className="row mx-auto">
          <button className="mt-4 btn btn-primary" type="button" onClick={() => loginUser()}>Log In</button>
        </div>
        <div className="row mt-2">
          <p>
            Don&apos;t have an account?
            {' '}
            <Link to="../signup">Sign up!</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default LogIn
