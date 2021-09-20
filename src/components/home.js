import React, { useState, useCallback } from 'react'
import { Link } from "react-router-dom"

const Home = props => {
  let sites = []

  for(const key in props.sites) {
    sites.push({
      text: props.sites[key].name,
      value: props.sites[key].name,
      acceptCompanies: props.sites[key].acceptCompanies
    })
  }

  const siteChangeHandler = (text, ac) => {
    props.siteChanged(text)
    props.acceptCompanies(ac)
  }

  return (
    <div>
      <div className="HOMEPAGE__section">
        <Link to="/">
          <img src="assets/images/home.svg" alt=""/> Pradinis
        </Link>
        <div className="HOMEPAGE__section-title">
          Pasirinkite aikštelę
        </div>
      </div>
      <div className="HOMEPAGE__input">
        <input type='text' value={props.searchingSite} onChange={props.searchSite}/>
        <div className="HOMEPAGE__input-select" style={{marginBottom: "40px"}}>{sites.map(fc => <p key={fc.text} onClick={() => siteChangeHandler(fc.text, fc.acceptCompanies)}>{fc.text}</p>)}</div>
      </div>
    </div>
  )
}

export default Home
