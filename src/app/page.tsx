"use client"
import { useState } from 'react'
import  Header from './component/Header'
import Footer from './component/Footer'
import Hero from './component/Hero'
import Groups from './component/Groups'
import About from './component/About'
import Verse from './component/Verse'
import Service from './component/Service'
import Contact from './component/Contact'
import Sermon from './component/Sermon'
import Give from './component/Give'
import Donate from './component/DonateCTA'
export default function Home() {
    const [showPledge, setShowPledge] = useState(false);
  return ( <>  

  <Header/>
  <Hero/>
   <About/>
  <Groups/>
  <Sermon/>
  <Service/>
  <Verse/>
  <Give onOpenPledge={() => setShowPledge(true)} />
{showPledge && <Donate onClose={() => setShowPledge(false)} />}
  <Contact/>
   <Footer/>
    </>
  );
}
