import React, { useState, Fragment, useEffect, useRef, useCallback } from 'react'
import moment from "moment"
import { Link } from "react-router-dom"

import NewWasteWho from './newWasteWho'
import NewWasteReceived from './newWasteReceived'
import Overlay from '../containers/overlay/overlay'
import EmailPopUp from './emailPopUp'

const NewWaste = props => {
  const [filteredClients, setFilteredClients] = useState([])
  const [identifiedClient, setIdentifiedClient] = useState(false)
  const [usedFreeLimit, setUsedFreeLimit] = useState({
    relatable: false,
    notRelatable: false
  })
  const [emailPopUp, setEmailPopUp] = useState(false)
  const [emailToSend, setEmailToSend] = useState('')

  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [document, setDocument] = useState({value: 'id', text: 'Asmens tapatybės kortelė'})
  const [documentNr, setDocumentNr] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [municipality, setMunicipality] = useState('')

  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [carNr, setCarNr] = useState('')
  const [driver, setDriver] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyCode, setCompanyCode] = useState('')
  const [contractNr, setContractNr] = useState('')
  const [ats, setAts] = useState('')
  const [companyMunicipality, setCompanyMunicipality] = useState('')

  const nameRef = useRef()
  const surnameRef = useRef()
  const companyNameRef = useRef()
  const mountedRef = useRef(false)

  const [clientWastes, setClientWastes] = useState([
    {
      date: moment().format("YYYY-MM-DDTHH:mm"),
      selectedWaste: '',
      quantity: '',
      origin: '',
      paymentDocument: '',
      handlingCode: ''
    }
  ])
  const [openDropDown__document, setOpenDropDown__document] = useState(false)
  const [openDropDown__municipality, setOpenDropDown__municipality] = useState(false)
  const [openDropDown__companyMunicipality, setOpenDropDown__companyMunicipality] = useState(false)

  const [documentNrError, setDocumentNrError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [surnameError, setSurnameError] = useState(false)

  // effect just for tracking mounted state
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const getClients = useCallback(async () => {
    mountedRef.current = true

    const response = await fetch("https://vaatc-3d080-default-rtdb.firebaseio.com/clients.json", {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }})

      const resData = await response.json()
      if (mountedRef.current) {
        setClients(resData)
      }
  }, [])

  useEffect(() => {
      getClients()
  }, [getClients])



  // GET COMPANIES
  const getCompanies = useCallback(async () => {
    mountedRef.current = true

    const response = await fetch("https://vaatc-3d080-default-rtdb.firebaseio.com/companies.json", {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }})

      const resData = await response.json()
      if (mountedRef.current) {
        setCompanies(resData)
      }
  }, [])

  useEffect(() => {
      getCompanies()
  }, [getCompanies])



  // RESET DATA saveDataFunction
  const resetData = useCallback(() => {
    setName('')
    setSurname('')
    setDocument('id')
    setDocumentNr('')
    setCity('')
    setStreet('')
    setMunicipality('')
    setClientWastes([
      {
        date: moment().format("YYYY-MM-DDTHH:mm"),
        selectedWaste: '',
        quantity: '',
        origin: '',
        paymentDocument: '',
        handlingCode: ''
      }
    ])
    setDriver('')
    setCompanyName('')
    setCompanyCode('')
    setContractNr('')
    setAts('')
    setCompanyMunicipality('')
    setFilteredCompanies([])
    setIdentifiedClient(false)
    getClients()
  }, [getClients])



  // FUNCTIONS
    // save data
  const saveDataFunction = async () => {
    if(name !== '' && surname !== '' && document !== '' && documentNr !== '') {
      await fetch('https://vaatc-3d080-default-rtdb.firebaseio.com/clients.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            surname,
            document,
            documentNr,
            city,
            street,
            municipality,
            wastes: clientWastes,
            usedFreeLimit: usedFreeLimit
          })
        }
      ).then(() => resetData())
    } else {
      if(name === '') {
        setNameError('Vardas yra privalomas!')
      }
      if(surname === '') {
        setSurnameError('Pavardė yra privaloma!')
      }
      if(documentNr === '') {
        setDocumentNrError('Neįvestas dokumento nr!')
      }
    }
  }

  const updateDataFunction = async (id) => {
    if(name !== '' && surname !== '' && document !== '' && documentNr !== '') {
      let updatedWastes = [...clients[identifiedClient].wastes, ...clientWastes]

      await fetch(`https://vaatc-3d080-default-rtdb.firebaseio.com/clients/${id}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            surname,
            document,
            documentNr,
            city,
            street,
            municipality,
            wastes: updatedWastes,
            usedFreeLimit: usedFreeLimit
          })
        }
      ).then(() => resetData())
    } else {
      if(name === '') {
        setNameError('Vardas yra privalomas!')
      }
      if(surname === '') {
        setSurnameError('Pavardė yra privaloma!')
      }
    }
  }

  const saveCompanyDataFunction = async () => {
    // if(name !== '' && surname !== '' && document !== '' && documentNr !== '') {

      await fetch('https://vaatc-3d080-default-rtdb.firebaseio.com/companies.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            carNr,
            driver,
            companyName,
            companyCode,
            contractNr,
            ats,
            companyMunicipality,
            wastes: clientWastes,
            usedFreeLimit: usedFreeLimit
          })
        }
      ).then(() => resetData())
    // }
  }


    // search client
  const searchClientBy = useCallback((by, value) => {
    let allClients = clients
    let newFilteredClients = []

    if(name.length > 0 && by === 'surname') {
      allClients = {}
      for(const key in clients) {
        if(clients[key].name.trim().toLowerCase() === name.trim().toLowerCase()) {
          allClients = {...allClients, [key]: clients[key]}
        }
      }
    }
    if(surname.length > 0 && by === 'name') {
      allClients = {}
      for(const key in clients) {
        if(clients[key].surname.trim().toLowerCase() === surname.trim().toLowerCase()) {
          allClients = {...allClients, [key]: clients[key]}
        }
      }
    }

    for(const key in allClients) {
      if(value.length === 0) {
        newFilteredClients = []
      }
      if(allClients[key][by].trim().toLowerCase().includes(value.trim().toLowerCase()) && value.length > 0) {
        if(!newFilteredClients.some(cl => cl.id === key)) {
          newFilteredClients.unshift({id: key, name: `${clients[key].name} ${clients[key].surname}`})
        }
      }
    }
    setFilteredClients(newFilteredClients)
  }, [clients, name, surname])



  // search company
const searchCompanyBy = useCallback((by, value) => {
  let allCompanies = companies
  let newFilteredCompanies = []

  if(companyName.length > 0 && by === 'companyName') {
    allCompanies = {}
    for(const key in companies) {
      console.log(companies[key].companyName)
      if(companies[key].companyName.trim().toLowerCase() === companyName.trim().toLowerCase()) {
        allCompanies = {...allCompanies, [key]: companies[key]}
      }
    }
  }

  for(const key in allCompanies) {
    if(value.length === 0) {
      newFilteredCompanies = []
    }
    if(allCompanies[key][by].trim().toLowerCase().includes(value.trim().toLowerCase()) && value.length > 0) {
      if(!newFilteredCompanies.some(cl => cl.id === key)) {
        newFilteredCompanies.unshift({id: key, name: `${companies[key].companyName}`})
      }
    }
  }
  setFilteredCompanies(newFilteredCompanies)
}, [companies, companyName])



  // SET CLIENT
  const clientHandler = id => {
    setIdentifiedClient(id)
    setName(clients[id].name)
    setSurname(clients[id].surname)
    setDocument(clients[id].document)
    setDocumentNr(clients[id].documentNr)
    setCity(clients[id].city)
    setStreet(clients[id].street)
    setMunicipality(clients[id].municipality)
    setFilteredClients([])
    setNameError(false)
    setSurnameError(false)
    setDocumentNrError(false)
  }



  // SET COMPANY
  const companyHandler = id => {
    setIdentifiedClient(id)
    setDriver(companies[id].driver)
    setCompanyName(companies[id].companyName)
    setCompanyCode(companies[id].companyCode)
    setContractNr(companies[id].contractNr)
    setAts(companies[id].ats)
    setCompanyMunicipality(companies[id].companyMunicipality)
    setFilteredCompanies([])
  }



  // SET NAME
  const setNameHandler = (e) => {
    nameRef.current.style.display = 'block'
    surnameRef.current.style.display = 'none'
    let newName = e.target.value
    setName(newName)
    setNameError(false)

    searchClientBy('name', newName)
  }



  // SET SURNAME
  const setSurnameHandler = (e) => {
    surnameRef.current.style.display = 'block'
    nameRef.current.style.display = 'none'
    let newSurname = e.target.value
    setSurname(newSurname)
    setSurnameError(false)

    searchClientBy('surname', newSurname)
  }


  const companyMunicipalityHandler = (value) => {
    setCompanyMunicipality(value)
    setOpenDropDown__companyMunicipality(false)
  }



  // SET COMPANY NAME
  const companyNameHandler = (e) => {
    companyNameRef.current.style.display = 'block'
    let newName = e.target.value
    setCompanyName(newName)

    searchCompanyBy('companyName', newName)
  }



  // ADD NEW WASTE
  const addNewWasteHandler = () => {
    let currentWastes = [...clientWastes]

    currentWastes.push({
      date: moment().format("YYYY-MM-DDTHH:mm"),
      selectedWaste: '',
      quantity: '',
      origin: '',
      paymentDocument: '',
      handlingCode: ''
    })

    setClientWastes(currentWastes)
  }



  // REMOVE WASTE
  const removeWasteHandler = index => {
    let currentWastes = [...clientWastes]

    currentWastes.splice(index, 1)

    setClientWastes(currentWastes)
  }



  // SET QUANTITY
  const quantityHandler = (e, index) => {
    let quantity = parseInt(e.target.value)
    let newUsedFreeLimit = {...usedFreeLimit}

    // selected waste
    let currentWastes = [...clientWastes]

    if(quantity !== 0 && Object.keys(currentWastes[index].selectedWaste).length === 0) {
      currentWastes[index].error2 = 'Nepasirinkta atlieka!'
      return
    }

    const id = Object.keys(currentWastes[index].selectedWaste)[0]
    let selectedWaste = currentWastes[index].selectedWaste[Object.keys(currentWastes[index].selectedWaste)[0]]
    currentWastes[index].quantity = quantity || ''

    // client
    let clientRelatableFreeLimit = {}, clientNotRelatableFreeLimit = {}

      // client exists
      if(identifiedClient) {
        let client = clients[identifiedClient]
        clientRelatableFreeLimit = client.usedFreeLimit.relatable ? client.usedFreeLimit.relatable : false
        clientNotRelatableFreeLimit = client.usedFreeLimit.notRelatable ? client.usedFreeLimit.notRelatable : false
      }

      // add client past limits
      newUsedFreeLimit = {relatable: clientRelatableFreeLimit, notRelatable: clientNotRelatableFreeLimit}
      // relatable limit
      if(selectedWaste.related !== undefined) {
        // Related waste addition
        if(Object.keys(newUsedFreeLimit.relatable).length > 0) {
          for(const key in newUsedFreeLimit.relatable) {
            // Then exist related waste
            if(key === selectedWaste.related) {
              newUsedFreeLimit = {...newUsedFreeLimit, relatable: {[selectedWaste.related]: newUsedFreeLimit.relatable[key] + quantity}}
            }
          }
        } else {
          // Then not exist related waste
          newUsedFreeLimit = {...newUsedFreeLimit, relatable: {...newUsedFreeLimit.relatable, [selectedWaste.related]: quantity}}
        }
      } else if(selectedWaste.related === undefined) {
        // Not related waste addition
        if(Object.keys(newUsedFreeLimit.notRelatable).length > 0) {
          // Then exists
            for(const key in newUsedFreeLimit.notRelatable) {
              if(key === id) {
                newUsedFreeLimit = {...newUsedFreeLimit, notRelatable: {[key]: newUsedFreeLimit.notRelatable[key] + quantity}}
              }
            }
          } else {
              // Then not exists
              newUsedFreeLimit = {...newUsedFreeLimit, notRelatable: {...newUsedFreeLimit.notRelatable, [Object.keys(currentWastes[index].selectedWaste)[0]]: quantity}}
          }
        }
      setUsedFreeLimit(newUsedFreeLimit)

    // limits messages
    const maxLimit = parseInt(selectedWaste.max_limit)
    const freeLimit = parseInt(selectedWaste.free_limit)
    let limited

    // MAX limit error
    if(quantity > maxLimit) {
      currentWastes[index].error = `Viršytas maksimalus limitas. Galima priimti ${maxLimit} ${clientWastes[index].selectedWaste[id].uom}.`
    } else {
      delete currentWastes[index].error
    }

    // FREE limit error
    if(selectedWaste.related) {
      const groupId = selectedWaste.related
      limited = newUsedFreeLimit.relatable[groupId]

    } else if(selectedWaste.related === undefined) {
        limited = newUsedFreeLimit.notRelatable[id]
    }

    if(limited > freeLimit) {
      let quantityToPay = quantity

      if((limited - quantity) < freeLimit) {
        quantityToPay = limited - freeLimit
      }

      currentWastes[index].warning =`Viršytas nemokamo likučio kiekis. Bus apmokestinta už ${quantityToPay} ${clientWastes[index].selectedWaste[id].uom}.`
    } else {
      delete currentWastes[index].warning
    }

    setClientWastes(currentWastes)
  }



  // SET DATE
  const setDateHandler = (e, index) => {
    let currentWastes = [...clientWastes]

    currentWastes[index].date = e.target.value

    setClientWastes(currentWastes)
  }



  // SET DOCUMENT AND NR, ERROR HANDLING
  const setDocumentHandler = (value) => {
    let update

    switch(value) {
      case 'passport':
        update = {value: 'passport', text: 'Pasas'}
      break;
      case 'drivingId':
        update = {value: 'drivingId', text: 'Vairuotojo paŽymėjimas'}
      break;
      case 'permission':
        update = {value: 'permission', text: 'Leidimas nuolat gyventi'}
      break;
      case 'permission_temp':
        update = {value: 'permission_temp', text: 'Leidimas laikinai gyventi'}
      break;
    }
    setDocumentNr('')
    setDocument(update)
    setOpenDropDown__document(false)
  }

  const documentNrHandler = (e) => {
    const number = e.target.value

    let limited

    if(document.value === 'id' || document.value === 'passport' || document.value === 'drivingId') {
      limited = number.slice(0, 8)
    }

    if (document.value === 'permission' || document.value === 'permission_temp') {
      limited = number.slice(0, 7)
    }

    if(limited.length === 0) {
      setDocumentNrError(false)
    }

    setDocumentNr(limited)
  }

  const documentNrErrorHandler = () => {
    if(document.value === 'id' || document.value === 'passport' || document.value === 'drivingId') {
      if(documentNr.length < 8) {
        setDocumentNrError("Turi būti bent 8 skaičiai!")
      } else {
        setDocumentNrError(false)
      }
    }

    if (document === 'permission' || document === 'permission_temp') {
      if(documentNr.length < 7) {
        setDocumentNrError("Turi būti bent 7 skaičiai!")
      } else {
        setDocumentNrError(false)
      }
    }

    if(documentNr.length === 0) {
      setDocumentNrError(false)
    }
  }



  // MUNICIPALITY HANDLER
  const municipalityHandler = (value) => {
    setMunicipality(value)
    setOpenDropDown__municipality(false)
  }


  // SET ORIGIN
  const setOriginHandler = (value, index) => {
    let currentWastes = [...clientWastes]

    currentWastes[index].origin = value

    setClientWastes(currentWastes)
  }



  // UOM HANDLING
  const uomHandler = (e, index) => {
    let currentWastes = [...clientWastes]

    currentWastes[index].uom = e.target.value

    setClientWastes(currentWastes)
  }



  // SET WASTE MAKER
  const paymentDocumentHandler = (e, index) => {
    let currentWastes = [...clientWastes]

    currentWastes[index].paymentDocument = e.target.value

    setClientWastes(currentWastes)
  }

  // SET WASTE MAKER
  const handlingCodeHandler = (e, index) => {
    let currentWastes = [...clientWastes]

    currentWastes[index].handlingCode = e.target.value

    setClientWastes(currentWastes)
  }



  // SAVE
  const saveHandler = () => {
    clientWastes.map((w, index) => {
      if(w.error) {
        return
      }

      if(Object.keys(w.selectedWaste).length === 0) {
        let updateError = [...clientWastes]
        updateError[index].error2 = 'Nepasirinkta atlieka!'
        setClientWastes(updateError)
        return
      }
    })

    if(nameError || surnameError || documentNrError) {
      return
    }

    if(companyName) {
      saveCompanyDataFunction()
      return
    }

    if(identifiedClient) {
      updateDataFunction(identifiedClient)
    } else {
      saveDataFunction()
    }

  }

  return (
    <div className="DATASET">
      <div className="DATASET__notification">
        <div className="DATASET__notification-text">
          <img src="assets/images/tick.svg" alt="" /> Duomenys išsaugoti
        </div>
      </div>
      <div className="HOMEPAGE__section">
        <Link to="/">
          <img src="assets/images/home.svg" alt=""/> Pradinis
        </Link>
        <div className="HOMEPAGE__section-title">
          Iš ko priimama
        </div>
      </div>
      <div className="HOMEPAGE__section-title" style={{marginBottom: '40px'}}>
        Fizinis asmuo
      </div>
      <div className="DATASET__form">
        <div className="DATASET__form-title">
          Vardas
        </div>
        <div className="DATASET__form-title">
          Pavardė
        </div>
        <div className="DATASET__form-title">
          Asmens tapatybę patvirtinantis dokumentas
        </div>
        <div className="DATASET__form-title">
          Dokumento nr.
        </div>
        <div className="DATASET__form-title">
          Miestas
        </div>
        <div className="DATASET__form-title">
          Gatvė, namo, buto nr.
        </div>
        <div className="DATASET__form-title">
          Savivaldybė
        </div>

        <div className="DATASET__form-input">
          <input className={nameError ? "error" : ''} type='text' value={name} onChange={setNameHandler}/>
          <div className="HOMEPAGE__input-select" ref={nameRef}>{filteredClients.map(fc => <p key={fc.id} onClick={() => clientHandler(fc.id)}>{fc.name}</p>)}</div>
        </div>
        {
          nameError
            && <div className="DATASET__error" style={{gridColumn: "1"}}>
                 {nameError}
               </div>
        }

        <div className="DATASET__form-input">
          <input className={surnameError ? "error" : ''} type='text' value={surname} onChange={setSurnameHandler}/>
          <div className="HOMEPAGE__input-select" ref={surnameRef}>{filteredClients.map(fc => <p key={fc.id} onClick={() => clientHandler(fc.id)}>{fc.name}</p>)}</div>
        </div>
        {
          surnameError
            && <div className="DATASET__error" style={{gridColumn: "2"}}>
                 {surnameError}
               </div>
        }

          <div className="DATASET__form-input DROPDOWN">
            <input
              className={nameError ? "error" : ''}
              type='text'
              value={document.text}
              readOnly
              onClick={() => setOpenDropDown__document(!openDropDown__document)}
            />
            {
              openDropDown__document
               && <div className="HOMEPAGE__input-select DROP-OPTIONS">
                   <p onClick={() => setDocumentHandler('id')}>Asmens tapatybės kortelė</p>
                   <p onClick={() => setDocumentHandler('passport')}>Pasas</p>
                   <p onClick={() => setDocumentHandler('drivingId')}>Vairuotojo paŽymėjimas</p>
                   <p onClick={() => setDocumentHandler('permission')}>Leidimas nuolat gyventi</p>
                   <p onClick={() => setDocumentHandler('permission_temp')}>Leidimas laikinai gyventi</p>
                 </div>
            }
          </div>

        <div className="DATASET__form-input">
          <input className={documentNrError ? "error" : ''} value={documentNr} type='number' onChange={documentNrHandler} onBlur={documentNrErrorHandler} onFocus={() => setDocumentNrError(false)}/>
        </div>
        {
          documentNrError
            && <div className="DATASET__error" style={{gridColumn: "4"}}>
                 {documentNrError}
               </div>
        }
        <div className="DATASET__form-input">
          <input value={city} type='text'onChange={e => setCity(e.target.value)}/>
        </div>
        <div className="DATASET__form-input">
          <input value={street} type='text' onChange={e => setStreet(e.target.value)}/>
        </div>

        <div className="DATASET__form-input DROPDOWN">
          <input
            type='text'
            value={municipality}
            readOnly
            onClick={() => setOpenDropDown__municipality(!openDropDown__municipality)}
          />
          {
            openDropDown__municipality
             && <div className="HOMEPAGE__input-select DROP-OPTIONS">
                  {
                    props.counties.map(c => <p key={c.id} onClick={() => municipalityHandler(c.name)}>{c.name}</p>)
                  }
               </div>
          }
        </div>

      </div>
      {
        props.acceptCompanies
          &&  <Fragment>
                <div className="HOMEPAGE__section">
                  <div className="HOMEPAGE__section-title" style={{gridColumn: '2'}}>
                    Juridinis asmuo
                  </div>
                </div>
                <div className="DATASET__form">
                  <div className="DATASET__form-title">
                    Automobilio nr.
                  </div>
                  <div className="DATASET__form-title">
                    Vežėjas
                  </div>
                  <div className="DATASET__form-title">
                    Kliento pavadinimas
                  </div>
                  <div className="DATASET__form-title">
                    Kliento kodas
                  </div>
                  <div className="DATASET__form-title">
                    Sutarties Nr.
                  </div>
                  <div className="DATASET__form-title">
                    Ats
                  </div>
                  <div className="DATASET__form-title">
                    Savivaldybė
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={carNr} onChange={(e) => setCarNr(e.target.value)}/>
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={driver} onChange={(e) => setDriver(e.target.value)}/>
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={companyName} onChange={companyNameHandler}/>
                    <div className="HOMEPAGE__input-select" ref={companyNameRef}>{filteredCompanies.map(fc => <p key={fc.id} onClick={() => companyHandler(fc.id)}>{fc.companyName}</p>)}</div>
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}/>
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={contractNr} onChange={(e) => setContractNr(e.target.value)}/>
                  </div>
                  <div className="DATASET__form-input">
                    <input type="text" value={ats} onChange={(e) => setAts(e.target.value)}/>
                  </div>
                  <div className="DATASET__form-input DROPDOWN">
                    <input
                      type='text'
                      value={companyMunicipality}
                      readOnly
                      onClick={() => setOpenDropDown__companyMunicipality(!openDropDown__municipality)}
                    />
                    {
                      openDropDown__companyMunicipality
                       && <div className="HOMEPAGE__input-select DROP-OPTIONS">
                           <p onClick={() => companyMunicipalityHandler('Savivaldybė 1')}>Savivaldybė 1</p>
                           <p onClick={() => companyMunicipalityHandler('Savivaldybė 2')}>Savivaldybė 2</p>
                           <p onClick={() => companyMunicipalityHandler('Savivaldybė 3')}>Savivaldybė 3</p>
                         </div>
                    }
                  </div>

                </div>

              </Fragment>
      }
      {
        identifiedClient
          &&
  <Fragment>
  <div className="HOMEPAGE__section-title" style={{marginTop: "40px"}}>Jau priimta</div>
          <div className="newWaste-received">

              <div className="newWaste-received-titles">
                <div>Atlieka</div>
                <div>Dar galima pristatyti</div>
              </div>
              <NewWasteReceived
                client={clients[identifiedClient]}
              />
            </div>
              </Fragment>
      }

      <div className="HOMEPAGE__section RUBBISH">
        <div className="HOMEPAGE__section-title">
          Kas priimama
        </div>
      </div>
      {
          <Fragment>
            {
              clientWastes.map((cw, index) =>
                <Fragment key={index}>
                  <NewWasteWho
                    index={index}
                    date={clientWastes[index].date}
                    setDate={(e) => setDateHandler(e, index)}
                    wastes={props.wastes}
                    sites={props.sites}
                    clientWastes={clientWastes}
                    selectedWaste={clientWastes[0].selectedWaste[Object.keys(clientWastes[0].selectedWaste)[0]]}
                    selectedWasteHandler={(value) => setClientWastes(value)}
                    quantity={clientWastes[index].quantity}
                    quantityHandler={(e) => quantityHandler(e, index)}
                    origin={clientWastes[index].origin}
                    setOrigin={(value) => setOriginHandler(value, index)}
                    paymentDocument={clientWastes[index].paymentDocument}
                    setPaymentDocument={(e) => paymentDocumentHandler(e, index)}
                    handlingCode={clientWastes[index].handlingCode}
                    setHandlingCode={(e) => handlingCodeHandler(e, index)}
                    addNewWasteHandler={addNewWasteHandler}
                    removeWasteHandler={() => removeWasteHandler(index)}
                    clientWastesLength={clientWastes.length}
                    selectedSite={props.selectedSite}
                    name={name}
                    surname={surname}
                    document={document}
                    documentNr={documentNr}
                    documentNrError={documentNrError}
                    companyName={companyName}
                    uom={clientWastes[index].date}
                    uomHandler={(e) => uomHandler(e, index)}
                  />
                </Fragment>
              )
            }
            <button className="DATASET__submit" type="button" onClick={() => setEmailPopUp(true)}>Patvirtinti</button>
          </Fragment>
      }



      <Overlay
				visibility={emailPopUp ? 'visible' : 'hidden'}
				exit={() => setEmailPopUp(false)}
				needExit
			>
        <EmailPopUp
          email={(e) => setEmailToSend(e.target.value)}
          emailToSend={emailToSend}
          saveHandler={saveHandler}
        />
			</Overlay>
  </div>
  )
}

export default NewWaste
