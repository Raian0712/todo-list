import Layout from '../components/Layout'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import '../styles/Table.css'
import { ToastProvider } from 'react-toast-notifications'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </ApolloProvider>
    
  )
}

export default MyApp
