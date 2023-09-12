import React from 'react'
import './footer.css'
import {EnvelopeSimple, InstagramLogo, PinterestLogo, WhatsappLogo, YoutubeLogo} from "phosphor-react";

export const Footer = () => {
  return (
    <div>
        <div className="footer">
            <div className="sections">
            <div className="left-section">
            <p>Subscribe for early updates, offers.</p>
            </div>
            <div className="right-section">
           <h4>Connect</h4>
           
           <br />
           <div className="logos">
            <a href="/"><YoutubeLogo/> Youtube</a><br />
            <a href="/"><PinterestLogo/> Pinterest</a><br />
            <a href="/"><InstagramLogo/> Instagram</a><br />
            <a href="/"><WhatsappLogo/> Whatsapp us</a><br />
            <p><EnvelopeSimple/>ContactSytn@gmail.com</p><br />
            </div>
            </div>
            </div>
        <div className="df">
        <hr />
            <a href="/">MY ACCOUNT</a>
            <a href="/">TERMS OF SERVICE</a>
            <a href="/">PRIVACY POLICY</a>
            <a href="/">EXCHANGE & CANCELLATION POLICY</a>
            <a href="/">SHIPPING & DELIVERY POLICY</a>


        </div>

        </div>
      
    </div>
  )
}

export default Footer
