import React, { Fragment, useState, useEffect } from 'react'
import moment from "moment"
import ReactHTMLDatalist from "react-html-datalist"

const NewWasteWho = props => {
  const [showInfo, setShowInfo] = useState(false)
  const [openDropDown__origin, setOpenDropDown__origin] = useState(false)
  const [openDropDown__wastes, setOpenDropDown__wastes] = useState(false)
  const [filteredWastes, setFilteredWastes] = useState(props.wastes)
  const [searchingWaste, setSearchingWaste] = useState('')

  useEffect(() => {
    if(props.clientWastes[props.index].selectedWaste && props.clientWastes[props.index].quantity !== '') {
      setShowInfo(true)
    }
  }, [props.clientWastes[props.index].selectedWaste, props.clientWastes[props.index].quantity])

  let wastes = []

  for(const key in filteredWastes) {
    if(filteredWastes[key].sites) {
      filteredWastes[key].sites.map(s => {
        if(props.sites[s].name === props.selectedSite) {
          wastes.push({text: `${filteredWastes[key].code} - ${filteredWastes[key].waste}`, value: key})
        }
      })
    }
  }

  // CHANGE WASTE
  const changeWasteHandler = (value) => {
    const id = value
    const waste = props.wastes[id]

    const lastIndex = props.clientWastes.length - 1

    let currentWastes = [...props.clientWastes]

    currentWastes[lastIndex].selectedWaste = {[id]: waste}
    currentWastes[lastIndex].quantity = ''
    currentWastes[lastIndex].error = false
    currentWastes[lastIndex].date = moment().format("YYYY-MM-DDTHH:mm")

    props.selectedWasteHandler(currentWastes)
    setSearchingWaste(currentWastes[lastIndex].selectedWaste[Object.keys(currentWastes[lastIndex].selectedWaste)[0]].waste)
    setOpenDropDown__wastes(false)
  }

  // SEARCH WASTE IN LIST
  const searchWasteHandler = (e) => {
		let value = e.target.value
		setSearchingWaste(value)
		let newest

		for(const key in props.wastes) {
			if(props.wastes[key].waste.toLowerCase().includes(value.toLowerCase())) {
				newest = {...newest, [key]: props.wastes[key]}
			}
	  }

		setFilteredWastes(newest)
	}

  const changeOriginHandler = (value) => {
    props.setOrigin(value)
    setOpenDropDown__origin(false)
  }

  return (
    <Fragment>
      <div className="DATASET__status">

        <div className={`DATASET__form RUBBISH ${props.selectedWaste && props.selectedWaste.uom !== 'vnt' ? 'GRID7' : 'GRID6'}`}>
          {
            props.index === 0
              &&  <Fragment>
                    <div className="DATASET__form-title">
                      Data
                    </div>
                    <div className="DATASET__form-title">
                      Atlieka
                    </div>
                    {
                      props.selectedWaste && props.selectedWaste.uom !== 'vnt'
                        &&  <div className="DATASET__form-title">
                              Gautas kiekis, vnt.
                            </div>
                    }
                    <div className="DATASET__form-title">
                      Gautas kiekis{props.selectedWaste && props.selectedWaste.uom && `, ${props.selectedWaste.uom}`}
                    </div>
                    <div className="DATASET__form-title">
                      Atliekų kilmė
                    </div>
                    <div className="DATASET__form-title">
                      Mokėjimo dokumentas
                    </div>
                    <div className="DATASET__form-title">
                      Tvarkymo kodas
                    </div>
                  </Fragment>
          }
          <div className={`DATASET__form-input ${props.index === 0 && 'DATE'}`}>
            {
              props.index === 0
                && <input type="datetime-local" value={props.date} max={moment().format("YYYY-MM-DDTHH:mm")} onChange={props.setDate} />
            }
          </div>

          <div className="DATASET__form-input DROPDOWN">
            <input
              className={`${props.clientWastes[props.index].error && props.clientWastes[props.index].error}`}
              onChange={searchWasteHandler}
              type='text'
              value={searchingWaste}
              onClick={() => setOpenDropDown__wastes(!openDropDown__wastes)}
            />
            {
              openDropDown__wastes
               && <div className="HOMEPAGE__input-select DROP-OPTIONS">
                   {wastes.map(w => <p key={w.value} onClick={() => changeWasteHandler(w.value)}>{w.text}</p>)}
                 </div>
            }
            {
              props.clientWastes[props.index].error2
                && <div className="DATASET__error" style={{gridColumn: "2"}}>
                {props.clientWastes[props.index].error2}
              </div>
            }
          </div>

          {
            props.selectedWaste && props.selectedWaste.uom !== 'vnt'
              &&  <div className="DATASET__form-input">
                    <input type="text" uom={props.uom} onChange={props.uomHandler}/>
                  </div>
          }

          <div className={`DATASET__form-input INFO ${props.clientWastes[props.index].selectedWaste
                                                            && props.clientWastes[props.index].quantity !== ''
                                                            && props.clientWastes[props.index]
                                                            && !props.clientWastes[props.index].warning
                                                            && !props.clientWastes[props.index].error ? 'free' : ''}
                                                        ${props.clientWastes[props.index].selectedWaste
                                                            && props.clientWastes[props.index].quantity !== ''
                                                            && props.clientWastes[props.index]
                                                            && props.clientWastes[props.index].warning ? 'paid' : ''}
                                                        ${props.clientWastes[props.index].selectedWaste
                                                            && props.clientWastes[props.index].quantity !== ''
                                                            && props.clientWastes[props.index]
                                                            && props.clientWastes[props.index].error ? 'max' : ''}`}>
                <input type='number' value={props.quantity} onChange={props.quantityHandler}/>
                {
                  props.clientWastes[props.index].selectedWaste && props.clientWastes[props.index].quantity !== '' && showInfo
                    &&  <div className="DATASET__form-limits">
                          {
                            props.clientWastes[props.index] && !props.clientWastes[props.index].warning && !props.clientWastes[props.index].error
                              && <div className="DATASET__form-limits-agree">
                                   Nemokamas kiekis iki {props.selectedWaste && props.selectedWaste.free_limit} {props.selectedWaste && props.selectedWaste.uom}.
                                 </div>
                          }
                          {
                            props.clientWastes[props.index] && props.clientWastes[props.index].warning && !props.clientWastes[props.index].error
                              && <div className="DATASET__form-limits-paid">
                                   Mokamas kiekis virš {props.selectedWaste && props.selectedWaste.free_limit} {props.selectedWaste && props.selectedWaste.uom}.
                                 </div>
                          }
                          {
                            props.clientWastes[props.index] && props.clientWastes[props.index].error
                              && <div className="DATASET__form-limits-maximum">
                                   Maksimalus kiekis {props.selectedWaste && props.selectedWaste.max_limit} {props.selectedWaste && props.selectedWaste.uom}.
                                 </div>
                          }

                          <div className="DATASET__form-limits-text1" style={props.clientWastes[props.index] && props.clientWastes[props.index].warning || props.clientWastes[props.index].error ? {display: 'block'}: {display: 'none'}}>
                            {props.clientWastes[props.index] && props.clientWastes[props.index].warning && !props.clientWastes[props.index].error ? props.clientWastes[props.index].warning : ''}
                            {props.clientWastes[props.index] && props.clientWastes[props.index].error ? props.clientWastes[props.index].error : ''}
                          </div>

                          <button className="DATASET__form-limits-button" type="button" onClick={() => setShowInfo(false)} name="button">Uždaryti</button>
                        </div>
                }
              </div>

          <div className="DATASET__form-input DROPDOWN">
            <input
              onClick={() => setOpenDropDown__origin(!openDropDown__origin)}
              type='text'
              readOnly
              value={props.origin}
            />
            {
              openDropDown__origin
               && <div className="HOMEPAGE__input-select DROP-OPTIONS">
                   <p onClick={() => changeOriginHandler('Kilmė 1')}>Kilmė 1</p>
                   <p onClick={() => changeOriginHandler('Kilmė 2')}>Kilmė 2</p>
                   <p onClick={() => changeOriginHandler('Kilmė 3')}>Kilmė 3</p>
                 </div>
            }
          </div>

          <div className="DATASET__form-input">
            <input type="text" onChange={props.setPaymentDocument} value={props.paymentDocument}/>
          </div>
          <div className="DATASET__form-input">
            <input type="text" onChange={props.setHandlingCode} value={props.handlingCode}/>
          </div>

          <div className="DATASET__form-input ADD" style={{display: 'flex'}}>
            {props.index === 0 && props.clientWastesLength === 1 || props.index + 1 === props.clientWastesLength ? <button onClick={props.addNewWasteHandler}  type="button" name="button"><img src="assets/images/plus.svg" alt=""/> Pridėti atlieką</button> : ''}
            {props.index !== 0 ? <button onClick={props.removeWasteHandler}><img src="assets/images/minus.svg" alt=""/> Panaikinti atlieką</button> : ''}
          </div>
        </div>

        <div className="DATASET__disabled" style={props.name !== '' && props.surname !== '' && props.document !== '' && props.documentNr !== '' && !props.documentNrError || props.companyName ? {display: 'none'} : {display: 'block'}}></div>
      </div>
    </Fragment>
  )
}

export default NewWasteWho
