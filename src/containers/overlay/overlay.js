import React, {useState, useEffect } from 'react'
import ExitButton from './exitButton'

const Overlay = (props) => {
	const [visibility, setVisibility] = useState(props.visibility)

	useEffect(() => {
		setVisibility(props.visibility)
	}, [props.visibility])

	const exit = () => {
		setVisibility('hidden')
		if(props.needExit) {
			props.exit()
		}
	}

	const pressOverlay = () => {
		setVisibility('hidden')
		if(props.needExit) {
			props.exit()
		}
	}

	const stopPropagation = (e) => {
		 e.stopPropagation()
	}

	return (
		<div onClick={pressOverlay} id="overlay" style={{visibility}}>
			<div onClick={stopPropagation} id="overlay-container">
				<ExitButton action={exit}/>
				{props.children}
			</div>
		</div>
	)
}

export default Overlay
