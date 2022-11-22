import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import avatarUsers from '../assets/stories.png';
import iconCheckImg from '../assets/icon-check.svg';

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso! O código foi copiado para a área de transferência.')
      setPoolTitle('')

    } catch (err) {
      console.log('error: ', err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
    
  }

  return (
    <div className='max-w-[1124px] h-screen gap-28 mx-auto grid grid-cols-2 items-center'>
      <main>
        <Image 
          src={logoImg} 
          alt='NLW Copa logo' 
        />

        <h1 className='mt-14 text-white text-4xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2 '>
          <Image src={avatarUsers} alt="usuários" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-green-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' 
            type='submit'
          >
            Criar meu bolão
          </button>
        </form>

        <p 
          className='text-gray-300 mt-4 text-sm leading-relaxed'
        >
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-xl'>+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-12 bg-gray-600' />

          <div>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
          </div>
        </div>
      </main>


      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da app móvel NLW Copa"
        quality={100}
      />

    </div>
  )
}

//  ver getStaticProps
export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    guessesCountResponse,
    usersCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      pollCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: usersCountResponse.data.count,
    }
  }
}
