import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../../Components/Spinner'
import { Outlet, useNavigate } from 'react-router-dom'
import { Protected_Route } from '../../Services/Api'

const Protected = () => {
  const token = useSelector(state => state.user.token)
  console.log(token)
  const navigate = useNavigate()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await Protected_Route({
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res?.data?.ok) {
          setOk(true)
          console.log('✅ Authorized User')
        } else {
          setOk(false)
          console.log('⛔ Unauthorized User')
          navigate('/login')
        }
      } catch (error) {
        console.log('Error in authCheck:', error.message)
        setOk(false)
        navigate('/login')
      }
    }

    if (token) authCheck()
    

  }, [token,navigate])

  return ok ? <Outlet /> : <Spinner />
}

export default Protected;
