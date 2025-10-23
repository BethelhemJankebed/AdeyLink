import React, { useState } from 'react'
import { AuthProvider, useAuth } from './components/AuthContext'
import { ThemeProvider, useTheme } from './components/ThemeContext'
import { Homepage } from './components/Homepage'
import { CategoryView } from './components/CategoryView'
import { VideoFeed } from './components/VideoFeed'
import { SellerProfile } from './components/SellerProfile'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Cart } from './components/Cart'
import { Messaging } from './components/Messaging'
import { ProductDetail } from './components/ProductDetail'
import { Button } from './components/ui/button'
import { ShoppingCart, MessageCircle, User, LogOut, Moon, Sun } from 'lucide-react'
import { Toaster } from './components/ui/sonner'

type View = 
  | { type: 'home' }
  | { type: 'category'; category: string }
  | { type: 'videos'; category: string }
  | { type: 'seller'; sellerId: string }
  | { type: 'cart' }
  | { type: 'messaging'; userId?: string }

type ProductModal = {
  productId: string
  sellerId: string
} | null

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [view, setView] = useState<View>({ type: 'home' })
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [productModal, setProductModal] = useState<ProductModal>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth screens if not logged in
  if (!user) {
    if (authView === 'login') {
      return <Login onSignUpClick={() => setAuthView('signup')} />
    } else {
      return <SignUp onLoginClick={() => setAuthView('login')} />
    }
  }

  // Navigation bar (shown on most views)
  const showNav = view.type !== 'videos' && view.type !== 'messaging'

  return (
    <div className="min-h-screen bg-gray-50">
      {showNav && (
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setView({ type: 'home' })}
              className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              AdeyLink
            </button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView({ type: 'cart' })}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView({ type: 'messaging' })}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView({ type: 'seller', sellerId: user.id })}
              >
                <User className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      {view.type === 'home' && (
        <Homepage
          onCategoryClick={(category) => setView({ type: 'category', category })}
        />
      )}

      {view.type === 'category' && (
        <CategoryView
          category={view.category}
          onBack={() => setView({ type: 'home' })}
          onSellerClick={(sellerId) => setView({ type: 'seller', sellerId })}
          onViewVideos={(category) => setView({ type: 'videos', category })}
        />
      )}

      {view.type === 'videos' && (
        <VideoFeed
          category={view.category}
          onBack={() => setView({ type: 'category', category: view.category })}
          onSellerClick={(sellerId) => setView({ type: 'seller', sellerId })}
        />
      )}

      {view.type === 'seller' && (
        <SellerProfile
          sellerId={view.sellerId}
          onBack={() => setView({ type: 'home' })}
          onMessageClick={(sellerId) => setView({ type: 'messaging', userId: sellerId })}
          onProductClick={(productId) => {
            // Find the product's sellerId
            setProductModal({ productId, sellerId: view.sellerId })
          }}
        />
      )}

      {view.type === 'cart' && (
        <Cart onBack={() => setView({ type: 'home' })} />
      )}

      {view.type === 'messaging' && (
        <Messaging
          onBack={() => setView({ type: 'home' })}
          initialUserId={view.userId}
        />
      )}

      {/* Product Detail Modal */}
      {productModal && (
        <ProductDetail
          productId={productModal.productId}
          sellerId={productModal.sellerId}
          onClose={() => setProductModal(null)}
          onSellerClick={(sellerId) => {
            setProductModal(null)
            setView({ type: 'seller', sellerId })
          }}
        />
      )}

      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
