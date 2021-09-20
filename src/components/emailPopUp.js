import React from 'react'

const EmailPopUp = props => {
  return (
    <div className="pop-up">
      <h1>Ar norite gauti atliekų deklaraciją el. paštu?</h1>
      <div className="pop-up-wrapper">
        <input type="email" value={props.emailToSend} onChange={props.email}/>
        <label><input type="checkbox"/> Patvirtintu, kad mano pristatomos atliekos į sistemą įvestos teisingai. Sutinku, kad VAATC tvarkytų mano duomenis.</label>
        <div className="pop-up-buttons">
          <button onClick={props.saveHandler}>Siųsti deklaraciją</button>
          <button onClick={props.saveHandler}>Ne, ačiū</button>
        </div>
      </div>
    </div>
  )
}

export default EmailPopUp
