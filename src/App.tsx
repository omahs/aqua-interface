// External
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import React, { Suspense, Fragment, useEffect, useState, useCallback } from 'react'
import { CookiesProvider } from 'react-cookie'
import axios from 'axios'

// Styles
import { GlobalStyle } from './styles/Global'
import { theme } from './styles/theme'

// App Router
import { AppRouter } from './router'
import { useModal } from 'src/hooks/useModal'
import { Modal } from 'src/components/Modal'
import { ConfirmButton } from 'src/components/ConfirmButton'
import { SANCTION_LIST } from 'src/constants'
import { SanctionContext } from 'src/contexts'
import { Center } from './layouts/Center'

export const App = () => {
  const { isShown, toggle } = useModal()
  const [sanction, setSanction] = useState<string>('false')

  const getGeoInfo = useCallback(() => {
    axios
      .get('https://ipapi.co/json/')
      .then(response => {
        const data = response.data
        if (SANCTION_LIST.indexOf(data.country_code) >= 0) {
          setSanction('true')
        } else {
          setSanction('false')
        }
      })
      .catch(() => {
        //
      })
  }, [])

  useEffect(() => {
    getGeoInfo()
  }, [getGeoInfo])

  const content = (
    <Fragment>
      <div>You agree to the Terms and Conditions of sale by pressing the Continue</div>
      <ConfirmButton onClick={() => toggle(true)}>Continue</ConfirmButton>
    </Fragment>
  )

  return (
    <CookiesProvider>
      <SanctionContext.Provider value={sanction}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Suspense fallback={<Center minHeight="100%">LOADING</Center>}>
            <BrowserRouter>
              <AppRouter />
              <Modal isShown={isShown} hide={toggle} modalContent={content} headerText="Confirmation" />
            </BrowserRouter>
          </Suspense>
        </ThemeProvider>
      </SanctionContext.Provider>
    </CookiesProvider>
  )
}
