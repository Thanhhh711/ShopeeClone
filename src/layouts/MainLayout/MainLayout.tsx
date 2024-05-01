import React from 'react'
import Footer from 'src/components/Footer'
import Headers from 'src/components/Header'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Headers />
      {children}
      <Footer />
    </div>
  )
}
