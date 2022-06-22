import React, {useState} from 'react';
import { ArrowUpCircleFill } from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap'

const ScrollButton = () =>{

const [visible, setVisible] = useState(false)

const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 250){
	setVisible(true)
	}
	else if (scrolled <= 250){
	setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'auto'
	});
};

window.addEventListener('scroll', toggleVisible);

return (
	<Button 
	    onClick={scrollToTop}
	    style={{display: visible ? 'inline' : 'none',position: 'fixed',right:'15%',bottom: '5vh',height: '40px',zIndex: '10',cursor: 'pointer'}}>
        <ArrowUpCircleFill style={{color:'white'}}/>
	</Button>
);
}

export default ScrollButton;
