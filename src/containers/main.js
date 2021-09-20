import React, { useState } from 'react'
import { Link } from "react-router-dom"

const Main = props => {
  const [openSites, setOpenSites] = useState(false)

  let places = []

  for(const key in props.sites) {
    places.push({
      text: props.sites[key].name,
      value: props.sites[key].name,
      acceptCompanies: props.sites[key].acceptCompanies
    })
  }

  const placeChangeHandler = (text, ac) => {
    setOpenSites(false)
    props.siteChanged(text)
    props.acceptCompanies(ac)
  }

  return (
    <div className="HOMEPAGE">
      <div className="HEADER">
        <div className="HEADER__logo">
          <Link to="/"><img src="assets/images/logo.svg" alt=""/></Link>
        </div>
        <ul className="HEADER__menu">
          <li><Link className={props.location.pathname === '/new-waste' ? "nav-on" : ''} to={props.site ? "/new-waste" : "/"}>Naujų atliekų priėmimas</Link></li>
          <li><a href="#">Esamų atliekų tvarkymas</a></li>
          <li><a href="#">Ataskaitos</a></li>
          <li className="dropdown active main-site">
            <input type='text' value={props.searchingSite} onChange={props.searchSite} onClick={() => setOpenSites(!openSites)}/>
            {
              openSites
                &&  <div className="HOMEPAGE__input-select option">{places.map(fc => <p key={fc.text} onClick={() => placeChangeHandler(fc.text, fc.acceptCompanies)}>{fc.text}</p>)}</div>
            }
          </li>


          <li><Link to="/settings"><img src="assets/images/settings.svg" alt=""/></Link></li>
        </ul>

      </div>
      {props.children}
    </div>
  )
}

export default Main
