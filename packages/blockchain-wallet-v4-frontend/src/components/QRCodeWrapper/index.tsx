import blockChainLogo from 'blockchain-info-components/src/Images/img/qr-logo.svg'
import QRCodeReact from 'qrcode.react'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    padding: 12px;
    border: 1px solid ${props => props.theme.grey000};
    border-radius: 6px;
    background-color: white;
  }
`

const imageSettings = {
  src: blockChainLogo,
  x: null,
  y: null,
  height: 45,
  width: 45,
  excavate: false
}

const QRCodeWrapper = (props: Props) => {
  const { value, size, showImage } = props

  return (
    <Wrapper>
      <QRCodeReact
        value={value}
        size={size}
        imageSettings={showImage ? imageSettings : null}
      />
    </Wrapper>
  )
}

type Props = {
  showImage?: boolean
  size: number
  value: string
}

export default QRCodeWrapper
