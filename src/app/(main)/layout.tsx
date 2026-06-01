import '@/styles/style.scss'
import { getGlobalLayout } from '../../utils/footerSettings'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LazyLoadInitializer from '../../components/LazyLoadInitializer'
import MainWrapper from '../../components/MainWrapper'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { footer: footerSettings, leftMenu, rightMenu } = await getGlobalLayout()

  return (
    <>
      <LazyLoadInitializer />
      {(leftMenu || rightMenu) && <Header leftMenu={leftMenu || undefined} rightMenu={rightMenu || undefined} />}
      <MainWrapper>{children}</MainWrapper>
      {footerSettings && <Footer footer={footerSettings} />}
    </>
  )
}
