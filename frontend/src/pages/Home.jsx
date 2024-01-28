import React from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector(state => state.user);

  console.log(currentUser, "jhgjhgk")

  return (
    <div>
      home
      <p>{currentUser?.email}</p>
    </div>
  )
}

export default Home
