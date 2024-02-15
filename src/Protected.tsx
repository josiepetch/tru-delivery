import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


const Protected = (props : any) => {
    const navigate = useNavigate()
    const { Component } = props

    useEffect(() => {
        let token = localStorage.getItem('token')
        if (!token){
            localStorage.setItem('tokenStatus', "Please login!")
            navigate('/', {replace: true})
        }
    })

    return (
        <Component />
    )
}

export default Protected