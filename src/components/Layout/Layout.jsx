import React from 'react'
import MainNavbar from '../Navbar/MainNavbar.jsx'
import Footer from '../Footer/Footer.jsx'
import CartSidebar from "../../components/Cart/CartSidebar.jsx"

function Layout({children}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CartSidebar/>
      <MainNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
