import React, { useState, useEffect, useCallback } from "react"
import { useHistory, Switch, Route } from "react-router-dom"

import Main from './containers/main'
import Home from './components/home'
import NewWaste from './components/newWaste'
import Settings from './components/settings'

const App = props => {
	const history = useHistory()

	const [sites, setSites] = useState([])
	const [counties, setCounties] = useState([])
	const [searchingSite, setSearchingSites] = useState('')
	const [filteredSites, setFilteredSites] = useState([])
	const [wastes, setWastes] = useState([])
	const [selectedSite, setSelectedSite] = useState('')
	const [acceptCompanies, setAcceptCompanies] = useState(false)

	const getWastesData = useCallback(async () => {
		const response = await fetch("https://vaatc-3d080-default-rtdb.firebaseio.com/wastes.json", {
		headers : {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}})
		const resData = await response.json()
		setWastes(resData)
	}, [])



	// FETCH SITES
	useEffect(() => {
		const getData = async () => {
			const response = await fetch("https://vaatc-3d080-default-rtdb.firebaseio.com/sites.json", {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
			}})
			const resData = await response.json()
				setSites(resData)
				setFilteredSites(resData)
		}

		getData()
	}, [])

	useEffect(() => {
		getWastesData()
	}, [getWastesData])



	// FETCH COUNTIES
	useEffect(() => {
		const getData = async () => {
			const response = await fetch("data/counties.json", {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
			}})
			const resData = await response.json()
				setCounties(resData.counties)
		}

		getData()
	}, [])

	useEffect(() => {
		getWastesData()
	}, [getWastesData])


	// RETURN IF NOT SELECTED SITE
	useEffect(() => {
		if(selectedSite) {
			history.push("/new-waste")
		} else {
			history.push("/")
		}
	}, [selectedSite, history])



	// SEARCH SITE
	const searchSiteHandler = (e) => {
		let value = e.target.value
		setSearchingSites(value)
		let newest

		// let found = false
		for(const key in sites) {
			if(sites[key].name.toLowerCase().includes(value.toLowerCase())) {
				newest = {...newest, [key]: sites[key]}
			}
	  }

		setFilteredSites(newest)
	}



	// CHANGE SITE
	const siteChangeHandler = (s) => {
		setSelectedSite(s)
		setSearchingSites(s)
	}



	// CHANGE WASTE
	const changeWasteHandler = (value, e, k) => {
		let updateWastes = {...wastes}

		if(value === "sites") {
			updateWastes = {...updateWastes, [k]: {...updateWastes[k], [value]: e}}
			// updateWastes = {...updateWastes, updateWastes[k]: {...updateWastes[k], sites: e}}
		} else {
			updateWastes[k][value] = e.target.value
		}


		if(value === "free_limit" && e.target.value === '') {
			updateWastes[k][value] = 'unlimited'
		}

		setWastes(updateWastes)
	}



	// UPDATE WASTE
	const saveChangedWasteHandler = () => {
		fetch('https://vaatc-3d080-default-rtdb.firebaseio.com/wastes.json',
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(wastes)
			}
		)
	}



	// DELETE WASTE
	const deleteWasteHandler = async (k) => {
		await fetch(`https://vaatc-3d080-default-rtdb.firebaseio.com/wastes/${k}.json`,
			{
				method: 'DELETE'
			}
		)
		getWastesData()
	}

	return (
		<div className="App">
			<Switch>
				<Main
					site={selectedSite}
					sites={filteredSites}
					siteChanged={siteChangeHandler}
					acceptCompanies={value => setAcceptCompanies(value)}
					searchSite={searchSiteHandler}
					searchingSite={searchingSite}>
					<Route
						exact path={'/'}
						render={(props) => <Home
							searchSite={searchSiteHandler}
							searchingSite={searchingSite}
							siteChanged={siteChangeHandler}
							sites={filteredSites}
							wastes={wastes}
							acceptCompanies={value => setAcceptCompanies(value)}
							selectedSite={selectedSite}/>}/>
					<Route
						path={'/new-waste'}
						render={(props) => <NewWaste
							wastes={wastes}
							sites={sites}
							selectedSite={selectedSite}
							acceptCompanies={acceptCompanies}
							counties={counties}/>}/>
					<Route
						path={'/settings'}
						render={(props) => <Settings
							sites={sites}
							wastes={wastes}
							changeWaste={changeWasteHandler}
							update={() => getWastesData()}
							saveChangedWaste={saveChangedWasteHandler}
							deleteWaste={deleteWasteHandler}/>}/>
				</Main>
			</Switch>
		</div>
	)
}

export default App
