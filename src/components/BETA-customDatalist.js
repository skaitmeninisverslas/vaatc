import React, { useState } from 'react'

const CustomDatalist = ({ list }) => {
  const [searching, setSearching] = useState('')
  const [filteredElement, setFilteredElements] = useState([])

  const searchingHandler = (e) => {
		let value = e.target.value
		setSearching(value)
		let newest

		for(const key in list) {
			if(list[key][searchBy].toLowerCase().includes(value.toLowerCase())) {
				newest = {...newest, [key]: list[key][searchBy]}
			}
	  }

		setFilteredElements(newest)
	}

  return (
    <div className="custom-datalist">
      <input type='text' value={searching} onChange={props.searchingHandler}/>
      <div className="custom-datalist-">
        {filteredElements.map(fc => <p key={fc.text} onClick={() => props.action(fc.text)}>{fc.text}</p>)}
      </div>
    </div>
  )
}

export default CustomDatalist
