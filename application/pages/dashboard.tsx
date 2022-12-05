import React, { useEffect } from "react"
import PageSetup from "./components/PageSetup"
const Dashboard = () => {
    useEffect(() => {
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => console.log(data))
            
    }, [])
    return (<PageSetup>

    </PageSetup>)
}

export default Dashboard