import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isAuthenticated } from '@/utils/auth'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 認証が必要なページの場合、ログイン状態をチェック
    const publicPages = ['/login'];
    const isPublicPage = publicPages.includes(router.pathname);
    
    if (!isPublicPage && !isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Component {...pageProps} />
  )
}