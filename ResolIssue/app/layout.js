export const dynamic = "force-dynamic";
import './globals.css'
import Navbar from '../components/navbar'

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-gray-50">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <Navbar />
        </div>
        <div className="pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
