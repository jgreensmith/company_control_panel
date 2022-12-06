import type { AppProps } from 'next/app'
import ModalContextProvider from '../utils/ModalContext';

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalContextProvider>
      <Component {...pageProps} />
    </ModalContextProvider>

  )
}
