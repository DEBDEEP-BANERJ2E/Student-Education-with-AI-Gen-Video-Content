import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './wagmi.config';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { About } from './pages/About';
import { Documentation } from './pages/Documentation';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/Dashboard';
import { YourPostings } from './pages/YourPostings';
import { Profile } from './pages/Profile';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                  </>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/about"
                element={
                  <>
                    <Navbar />
                    <About />
                  </>
                }
              />
              <Route
                path="/docs"
                element={
                  <>
                    <Navbar />
                    <Documentation />
                  </>
                }
              />
              <Route
                path="/services"
                element={
                  <>
                    <Navbar />
                    <Services />
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Navbar />
                    <Contact />
                  </>
                }
              />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/your-postings" element={<YourPostings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;