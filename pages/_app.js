import Script from 'next/script';

import { ThemeProvider } from 'next-themes';

import '../styles/globals.css';
import { NavBar, Footer } from '../components';

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute='class'>
      <div className='min-h-screen bg-white dark:bg-nft-dark'>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </div>
      <Script src='https://kit.fontawesome.com/ff3c932e87.js' crossorigin='anonymous' />
    </ThemeProvider>
  );
};

export default App;
