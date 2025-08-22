import  Header from './component/Header'
import Footer from './component/Footer'
import Hero from './component/Hero'
import DonateCTA from './component/DonateCTA'
import Groups from './component/Groups'
import About from './component/About'
import Verse from './component/Verse'
import Service from './component/Service'
import Contact from './component/Contact'
import Sermon from './component/Sermon'
export default function Home() {
  return ( <>  

   <Header/>
  <Hero/>
   <About/>
  <Groups/>
  <Sermon/>
  
  <Service/>
  <Verse/>
  <DonateCTA/>
  <Contact/>
   <Footer/>
    </>
  );
}
