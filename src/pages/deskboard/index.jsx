import { useState, useEffect } from "react"

function Deshboard () {
    const [isButtonClicked, setIsButtonClicked] = useState(true) //  initial value
    const [value, setValue] = useState(null);

    useEffect(()=>{
        setValue(10)
    },[]);


    function handleButtonClick(){
        setIsButtonClicked(!isButtonClicked)
        setValue(999)
    }

    return <>
       <h1>Deshboard</h1>
       {
        isButtonClicked ? `${value}Button CLiked`: "BUtton not clicked"
       }
       <p>{value}</p>
       <button onClick={handleButtonClick}>Submit</button>
       
    </>
}

export default Deshboard