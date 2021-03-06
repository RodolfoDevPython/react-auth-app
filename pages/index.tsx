import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { parseCookies } from 'nookies'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import styles from '../styles/Home.module.css'
import { withSSRGuest } from '../utils/withSSRGuest'

const Home: NextPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data)
  
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" onChange={ ({ target: { value } }) => setEmail(value) } />
      <input type="password" onChange={ ({ target: { value } }) => setPassword(value) } />

      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home


export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {
      
    }
  }
})