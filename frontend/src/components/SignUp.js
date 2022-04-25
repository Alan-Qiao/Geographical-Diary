import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const createUser = async () => {
    const resp = await axios.post('/account/signup', { username, password })
    if (resp.status === 201) {
      navigate('/')
    } else {
      alert('Signup failed, Please try again.')
    }
  }

  return (
    <>
      <h1 className="mt-4 mb-4">Sign Up</h1>
      <div className="col-4">
        <div className="form-group mt-4">
          <label className="form-label" htmlFor="username">Username:</label>
          <input className="form-control" id="username" type="text" onChange={e => setUsername(e.target.value)} value={username} />
        </div>
        <div className="form-group mt-4">
          <label className="form-label" htmlFor="password">Password:</label>
          <input className="form-control" id="password" type="password" onChange={e => setPassword(e.target.value)} value={password} />
        </div>
        <div className="row mx-auto mt-4">
          <button className="btn btn-primary" type="button" onClick={() => createUser()}>Sign Up</button>
        </div>
        <div className="row mt-2">
          <p>
            Already have an account?
            {' '}
            <Link to="../login">Log in here!</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignUp
