import navStyles from '../styles/Nav.module.css';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPlus, faList } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Drawer from './Drawer'

const NavList = [
  { name: 'Home', url: '/', current: false, icon: faHome },
  { name: 'Add', url: '/todos/add', current: false, icon: faPlus },
  { name: 'List', url: '/todos', current: false, icon: faList },
]

const Nav = () => {
  const router = useRouter()
  const [active, setActive] = useState(false)

  useEffect(() => {
    console.log(router)
    setCurrent(router.pathname)
  }, [router, router.pathname])

  function setCurrent(url: string) {
    NavList.forEach(item => {
      if (item.url === url) {
        item.current = true
      } else {
        item.current = false
      }
    })
  }

  const handleClick = () => {
    setActive(!active)  
  }

  return (
    <>
      <div className={navStyles.wrapper}>
        <div>
          <button
            className={navStyles.button}
            onClick={handleClick}
          >
            <svg
              className={navStyles.buttonContent}
              fill='none'
              stroke='black'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>
        <div className={navStyles.nav}>
          <h2 onClick={() => {router.push('/'); setCurrent('/')}}>To-Do Web App</h2>
          {NavList.map((item, index) => {
            return (
              <div key={index} onClick={() => setCurrent(item.url)}>
                <Link href={item.url} passHref>
                  <div className={`${navStyles.links} ${item.current ? navStyles.current : ''}`}>
                    <FontAwesomeIcon icon={item.icon} className={navStyles.icons} />
                    <a>{item.name}</a>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
        <Drawer isOpen={active} setIsOpen={setActive}>
          <div className={navStyles.drawer}>
            <h2 onClick={() => {router.push('/'); setCurrent('/')}}>To-Do Web App</h2>
            {NavList.map((item, index) => {
              return (
                <div key={index} onClick={(e) => setCurrent(item.url)}>
                  <Link href={item.url} passHref>
                    <div className={`${navStyles.links} ${item.current ? navStyles.current : ''}`}>
                      <FontAwesomeIcon icon={item.icon} className={navStyles.icons} />
                      <a>{item.name}</a>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Nav;