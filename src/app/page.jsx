


// src/app/page.tsx








/*   


"use client"
import { createClient } from "../app/utils/supabase/server";
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

import Scrollindicator from './component/ScrollIndicator'
import Loader from './component/Loader'
export default async function Home() {
    const [showPledge, setShowPledge] = useState(false);

  const supabase = await createClient();

  // 1. Fetch Sermons
  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Fetch Groups (If you moved them to Supabase too)
  const { data: groups } = await supabase.from("groups").select("*");



  return ( <>  
  <Scrollindicator/>
  <Header/>
  <Hero/>
   <About/>
   <Loader/>
   <Sermon serverSermons={sermons || []} />
      <Groups serverGroups={groups || []} />
  <Service/>
  <Verse/>
  <Give onOpenPledge={() => setShowPledge(true)} />
{showPledge && <Donate onClose={() => setShowPledge(false)} />}
  <Contact/>
   <Footer/>
    </>
  );
}

*/

// src/app/page.tsx






 




  
// src/app/page.jsx
// 1. REMOVE "use client"
// 2. REMOVE "import { useState } from 'react'"

import { createClient } from "./utils/supabase/server";
import Header from './component/Header'
import Footer from './component/Footer'
import Hero from './component/Hero'
import Groups from './component/Groups'
import About from './component/About'
import Verse from './component/Verse'
import Service from './component/Service'
import Contact from './component/Contact'
import Sermon from './component/Sermon'
import PledgeSection from './component/PledgeSection' // New wrapper
import Scrollindicator from './component/ScrollIndicator'
import Loader from './component/Loader'

export default async function Home() {
  // This now works because we are in a Server Component
  const supabase = await createClient();

  // Fetch Sermons
  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch Groups
  const { data: groups } = await supabase.from("groups").select("*");

  return (
    <> 
      <Scrollindicator/>
      <Header/>
      <Hero/>
      <About/>
      <Loader/>
      {/* Pass data as props */}
      <Groups serverGroups={groups || []} />
        <Sermon serverSermons={sermons || []} />
      <Service/>
      <Verse/>
      {/* Move showPledge logic into this component */}
      <PledgeSection />
      <Contact/>
      <Footer/>
    </>
  );
}