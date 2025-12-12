import React from 'react'
import Nav from "@/components/atoangUI/topnav";
import Footer from "@/components/atoangUI/footer";

export default function layout({ children }) {
  return (
     <>
          <Nav/>
          {children}
          <Footer />
     </>
  )
}
