import React from 'react'

const NewWasteReceived = props => {
  let clientRelatableFreeLimit = props.client.usedFreeLimit.relatable ? props.client.usedFreeLimit.relatable : false
  let clientNotRelatableFreeLimit = props.client.usedFreeLimit.notRelatable ? props.client.usedFreeLimit.notRelatable : false
  //
  let newUsedFreeLimit = {relatable: clientRelatableFreeLimit, notRelatable: clientNotRelatableFreeLimit}

  let limit
  const view = []

  props.client.wastes.map(w => {
    for(const key in w.selectedWaste) {
      if(w.selectedWaste[key].related) {
        for(const key2 in newUsedFreeLimit.relatable) {
          // console.log("key2", key2)
          // console.log("w.selectedWaste[key].related", w.selectedWaste[key].related)
          // Then exist related waste
          if(key2 === w.selectedWaste[key].related) {
            if(w.selectedWaste[key].free_limit > newUsedFreeLimit.relatable[key2]) {
              limit = `${w.selectedWaste[key].free_limit - newUsedFreeLimit.relatable[key2]} ${w.selectedWaste[key].uom}`
            } else {
              limit = "Viršytas nemokamas limitas"
            }
          }
        }
    }
    // else {
    //   // Then exists notRelatable
    //   for(const key3 in newUsedFreeLimit.notRelatable) {
    //     if(key === key3) {
    //       if(w.selectedWaste[key].free_limit > newUsedFreeLimit.notRelatable[key3]) {
    //         limit = `${w.selectedWaste[key].free_limit - newUsedFreeLimit.notRelatable[key3]} ${w.selectedWaste[key].uom}`
    //       } else {
    //         limit = "Viršytas nemokamas limitas"
    //       }
    //     }
    //   }
    // }
    view.push(
      <div key={key} className="newWaste-received-item">
        <div className="newWaste-received-item-waste">{`${w.selectedWaste[key].code} - ${w.selectedWaste[key].waste}`}</div>
        <div className="newWaste-received-item-amount">{limit}</div>
      </div>
    )
  }
})

  return (
    view
  )
}

export default NewWasteReceived
