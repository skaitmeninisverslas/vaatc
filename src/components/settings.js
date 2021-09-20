import React, { useState, Fragment } from 'react'

const Settings = props => {
  const [editingIndex, setEditingIndex] = useState(false)
  const [addingNewWaste, setAddingNewWaste] = useState(false)
  const [code, setCode] = useState('')
  const [waste, setWaste] = useState('')
  const [uom, setUom] = useState('kg')
  const [freeLimit, setFreeLimit] = useState('')
  const [freeLimitUnlimited, setFreeLimitUnlimited] = useState(false)
  const [relatable, setRelatable] = useState(false)
  const [related, setRelated] = useState('1')
  const [maxLimit, setMaxLimit] = useState('')
  const [price, setPrice] = useState('')
  const [priceVat, setPriceVat] = useState('')
  const [checkedSites, setCheckedSites] = useState([])

  // <td>
  //   <select defaultValue={filteredGroupes[key][key2].uom} onChange={(e) => props.changeWaste("uom", e, key2)}>
  //     <option value="kg">kg</option>
  //     <option value="vnt">vnt</option>
  //   </select>
  // </td>

  // <td>
  //   <select defaultValue={notRealatedWastes[key3].uom} onChange={(e) => props.changeWaste("uom", e, key3)}>
  //     <option value="kg">kg</option>
  //     <option value="vnt">vnt</option>
  //   </select>
  // </td>

  // <label>Mato vienetas:</label>
  // <select defaultValue={uom} onChange={(e) => setUom(e.target.value)}>
  //   {!uom ? <option value="kg">Pasirinkti...</option> : ''}
  //   <option value="kg">kg</option>
  //   <option value="vnt">vnt</option>
  //   <option value="m3">m3</option>
  // </select>



  // RESET DATA
  const resetData = () => {
    setEditingIndex(false)
    setAddingNewWaste(false)
    setCode('')
    setWaste('')
    setUom('')
    setFreeLimit('')
    setMaxLimit('')
    setPrice('')
    setPriceVat('')
    setCheckedSites([])
    setEditingIndex(false)
  }



  // CHOOSE SITE FOR WASTE
  const setEditingIndexHandler = (id) => {
    resetData()
    setEditingIndex(id)

    const newCheckedSites = [...checkedSites]
    const wasteSites = props.wastes[id].sites

    if(wasteSites) {
      wasteSites.map(ws => {
        Object.keys(props.sites).map(s => {
          if(ws === s) {
            newCheckedSites.push(ws)
            setCheckedSites(newCheckedSites)
          }
        })
      })
    }
  }

  const checkedSitesHandler = (e) => {
    const newCheckedSites = [...checkedSites]

    if(newCheckedSites.includes(e.target.value)) {
      const index = newCheckedSites.indexOf(e.target.value)
      if (index > -1) {
        newCheckedSites.splice(index, 1)
        setCheckedSites(newCheckedSites)
      }
      return
    }

    newCheckedSites.push(e.target.value)
    props.changeWaste("sites", newCheckedSites, editingIndex)
    setCheckedSites(newCheckedSites)
  }

  let sitesOptions = []
  for(const key4 in props.sites) {
    sitesOptions.push(
      <label key={key4}><input type="checkbox" value={key4} checked={checkedSites.some(s => s === key4)} onChange={checkedSitesHandler}/> {props.sites[key4].name}</label>
    )
  }



  // CREATE WASTE
  const saveChangedWaste = () => {
    props.saveChangedWaste()
    setEditingIndex(false)
  }

  const saveNewWasteHandler = async () => {
    let newfreeLimit = freeLimit
    if(freeLimitUnlimited) {
      newfreeLimit = 'unlimited'
    }

    if(code !== '' && waste !== '' && uom !== '' && newfreeLimit !== '' && maxLimit !== '' && price !== '' && priceVat !== '' && checkedSites.length > 0) {
      let body = {
          code,
          waste,
          uom,
          free_limit: newfreeLimit,
          max_limit: maxLimit,
          price,
          price_vat: priceVat,
          related,
          sites: checkedSites
      }
      if(!relatable) {
        delete body.related
      }

      await fetch('https://vaatc-3d080-default-rtdb.firebaseio.com/wastes.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    setAddingNewWaste(false)
    resetData()
    props.update()
    }
  }



  // FILTERING BY GROUPES
  let groupes = ["1", "2", "3", "4", "5", "6", "7"]
  let filteredGroupes = {}
  let notRealatedWastes = {}

  groupes.map(g => {
    let filtered = {}
    for(const key in props.wastes) {
      if(props.wastes[key].related === g) {
        filtered = {...filtered, [key]: props.wastes[key]}
      } else if (!props.wastes[key].related) {
        notRealatedWastes = {...notRealatedWastes, [key]: props.wastes[key]}
      }
      filteredGroupes = {...filteredGroupes, [g]: filtered}
    }
  })

  let view = []

  for(const key in filteredGroupes) {
    view.push(<tr key={key}><td style={{fontWeight: 'bold'}}>{key} grupė</td></tr>)
    for(const key2 in filteredGroupes[key]) {
      view.push(
        <tr key={key2}>
          <td>{filteredGroupes[key][key2].code}</td>
          <td>{filteredGroupes[key][key2].waste}</td>
          <td>{filteredGroupes[key][key2].uom}</td>
          <td>{filteredGroupes[key][key2].free_limit === 'unlimited' ? 'Neribojama' : filteredGroupes[key][key2].free_limit}</td>
          <td>{filteredGroupes[key][key2].max_limit}</td>
          <td>{filteredGroupes[key][key2].price}</td>
          <td>{filteredGroupes[key][key2].price_vat}</td>
          <td className="table-nav">
            <div className="DATASET__submit" style={{marginTop: '0px', cursor: 'pointer'}} onClick={() => setEditingIndexHandler(key2)}>Koreguoti</div>
            {/*<img onClick={() => props.deleteWaste(key2)} src="images/trash.svg"/>*/}
          </td>
        </tr>
      )
      if(editingIndex === key2) {
        view.pop()
        view.push(<tr key={`${key2}_2`}>
          <td>
            {/*<input type="text" onChange={(e) => props.changeWaste("code", e, key2)} value={filteredGroupes[key][key2].code}/>*/}
            {filteredGroupes[key][key2].code}
          </td>
          <td>
            {filteredGroupes[key][key2].waste}
            {/*<input type="text"  onChange={(e) => props.changeWaste("waste", e, key2)} value={filteredGroupes[key][key2].waste}/>*/}
          </td>
          <td>{filteredGroupes[key][key2].uom}</td>
          <td><input type="number" placeholder="Neribotam palikti tuščią lauką" value={filteredGroupes[key][key2].free_limit}  onChange={(e) => props.changeWaste("free_limit", e, key2)}/></td>
          <td><input type="number" value={filteredGroupes[key][key2].max_limit}  onChange={(e) => props.changeWaste("max_limit", e, key2)}/></td>
          <td><input type="number" value={filteredGroupes[key][key2].price}  onChange={(e) => props.changeWaste("price", e, key2)}/></td>
          <td><input type="number" value={filteredGroupes[key][key2].price_vat}  onChange={(e) => props.changeWaste("price_vat", e, key2)}/></td>

        </tr>, <tr><td colSpan="7"><div className="sitesOptions">{sitesOptions}</div></td>
                  <td className="table-nav">

                    <div className="DATASET__submit" style={{marginTop: '0px', cursor: 'pointer'}} onClick={saveChangedWaste}>Išsaugoti</div>
                    {/*<img onClick={() => resetData()} src="images/trash.svg"/>*/}
                  </td></tr>)
      }
    }
  }

  view.push(<tr><td style={{fontWeight: 'bold'}}>Nesumuojami</td></tr>)

  for(const key3 in notRealatedWastes) {
    view.push(
      <tr key={key3}>
        <td>{notRealatedWastes[key3].code}</td>
        <td>{notRealatedWastes[key3].waste}</td>
        <td>{notRealatedWastes[key3].uom}</td>
        <td>{notRealatedWastes[key3].free_limit === 'unlimited' ? 'Neribojama' : notRealatedWastes[key3].free_limit}</td>
        <td>{notRealatedWastes[key3].max_limit}</td>
        <td>{notRealatedWastes[key3].price}</td>
        <td>{notRealatedWastes[key3].price_vat}</td>
        <td className="table-nav">
          <div className="DATASET__submit" style={{marginTop: '0px', cursor: 'pointer'}} onClick={() => setEditingIndexHandler(key3)}>Koreguoti</div>

          {/*<img onClick={() => props.deleteWaste(key3)} src="images/trash.svg"/>*/}
        </td>
      </tr>
    )
    if(editingIndex === key3) {
      view.pop()
      view.push(<tr key={`${key3}_2`}>
        {/*td><input type="text" onChange={(e) => props.changeWaste("code", e, key3)} value={notRealatedWastes[key3].code}/></td>
        <td><input type="text"  onChange={(e) => props.changeWaste("waste", e, key3)} value={notRealatedWastes[key3].waste}/></td>*/}
        <td>{notRealatedWastes[key3].code}</td>
        <td>{notRealatedWastes[key3].waste}</td>
        <td>{notRealatedWastes[key3].uom}</td>
        <td><input type="number" value={notRealatedWastes[key3].free_limit}  onChange={(e) => props.changeWaste("free_limit", e, key3)}/></td>
        <td><input type="number" value={notRealatedWastes[key3].max_limit}  onChange={(e) => props.changeWaste("max_limit", e, key3)}/></td>
        <td><input type="number" value={notRealatedWastes[key3].price}  onChange={(e) => props.changeWaste("price", e, key3)}/></td>
        <td><input type="number" value={notRealatedWastes[key3].price_vat}  onChange={(e) => props.changeWaste("price_vat", e, key3)}/></td>

      </tr>, <tr><td colSpan="7"><div className="sitesOptions">{sitesOptions}</div></td>
                <td className="table-nav">

                  <div className="DATASET__submit" style={{marginTop: '0px', cursor: 'pointer'}} onClick={saveChangedWaste}>Išsaugoti</div>
                  {/*<img onClick={() => resetData()} src="images/trash.svg"/>*/}
                </td></tr>)
    }
  }

  return (
    <div className="settings">
      <h1>Nustatymai</h1>

      {
        addingNewWaste
          ?
        <div>
          <div className="DATASET__form settings">
            <div className="DATASET__form-title">
              Kodas
            </div>
            <div className="DATASET__form-title">
              Atlieka
            </div>
            <div className="DATASET__form-title">
              Nemokamas metinis limitas
            </div>
            <div className="DATASET__form-title">
              Didžiausias vienu metu galimas pristatyti kiekis:
            </div>
            <div className="DATASET__form-title">
              Įkainis be PVM
            </div>
            <div className="DATASET__form-title">
              Įkainis su PVM
            </div>
            <div className="DATASET__form-title">
              Sumavimas
            </div>
            <div className="DATASET__form-input">
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)}/>
            </div>
            <div className="DATASET__form-input">
              <input type="text" value={waste} onChange={(e) => setWaste(e.target.value)}/>
            </div>
            <div className="DATASET__form-input-checkboxes" style={{marginTop: '10px'}}>
              <label><input type="radio" checked={!freeLimitUnlimited} onChange={(e) => setFreeLimitUnlimited(false)}/> Ribojamas</label>
              {!freeLimitUnlimited && <input type="number" value={freeLimit} onChange={(e) => setFreeLimit(e.target.value)}/>}
              <label style={{marginLeft: '5px'}}><input type="radio" checked={freeLimitUnlimited} onChange={(e) => setFreeLimitUnlimited(true)}/> Neribojamas</label>
            </div>
            <div className="DATASET__form-input">
              <input type="number" value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)}/>
            </div>
            <div className="DATASET__form-input">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <div className="DATASET__form-input">
              <input type="number" value={priceVat} onChange={(e) => setPriceVat(e.target.value)}/>
            </div>
            <div className="DATASET__form-input-checkboxes" style={{marginTop: '10px'}}>
              <label style={{marginRight: '5px'}}><input type="radio" checked={!relatable} onChange={() => setRelatable(false)}/> Nesumuojamas</label>
              <label style={{marginRight: '5px'}}><input type="radio" checked={relatable} onChange={() => setRelatable(true)}/> Sumuojamas kartu su...</label>
              {relatable && <select style={{marginRight: '5px'}} value={related} onChange={(e) => setRelated(e.target.value)}>
                              <option value="1">Grupė 1</option>
                              <option value="2">Grupė 2</option>
                              <option value="3">Grupė 3</option>
                              <option value="4">Grupė 4</option>
                              <option value="5">Grupė 5</option>
                              <option value="6">Grupė 6</option>
                              <option value="7">Grupė 7</option>
                            </select>
              }
            </div>

          </div>
          <div className="HOMEPAGE__section-title">Aikštelės:</div>
          <div className="DATASET__form-input-checkboxes gap" style={{height: 'auto'}}>

          {sitesOptions}
          </div>
          <button style={{width: '150px', marginBottom: '40px'}} className="DATASET__submit" onClick={saveNewWasteHandler}>Išsaugoti</button>
        </div>

          : null

          /*<div className="addNewWaste" onClick={() => setAddingNewWaste(true)}>
              <img src="images/plus.svg"/>
              <p>Pridėti naują atlieką</p>
            </div>*/
      }

      <table>
        <thead>
          <tr>
            <th>Kodas</th>
            <th>Atlieka</th>
            <th>Mato vienetas</th>
            <th>Nemokamas metinis limitas</th>
            <th>Didžiausias vienu metu galimas pristatyti kiekis</th>
            <th>Įkainis be PVM</th>
            <th>Įkainis su PVM</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="DATASET__form-input">
          {view.map(v => v)}
        </tbody>
      </table>
    </div>
  )
}

export default Settings
