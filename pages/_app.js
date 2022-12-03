import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import { Navbar, Footer } from '../components/index';
import { ProjectProvider } from '../context/ProjectContext';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => (
  <ProjectProvider>
    <ThemeProvider attribute='class'>
      <div className='dark:bg-nft-dark bg-white min-h-screen'>
        <Navbar />
        <div className='pt-65'>
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
      <Script src='https://kit.fontawesome.com/ff3c932e87.js' crossorigin='anonymous' />
    </ThemeProvider>
  </ProjectProvider>
);

export default App;
