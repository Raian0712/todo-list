import Nav from './Nav';
import { useRouter } from 'next/router'

const Layout = ({ children }: any) => {
  const router = useRouter()
  return (
    <>
      <Nav />
      <div>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout