/* global $ */
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { Emp } from "./Employee/Dashboard";
import { AddOrUpdate } from "./Employee/AddOrUpdate";
import { State } from "./State/State";
import { City } from "./City/City";
import { Taluka } from "./Taluka/Taluka";
import Form from './Employee/Form'
import { createContext, useState } from "react";
export const themeContext=createContext()
function App() {
    const [theme,setTheme]=useState(false)
  return(
    <>
    <themeContext.Provider value={{theme,setTheme}}>
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Emp />}> </Route>
        <Route path="add" element={<AddOrUpdate />}></Route>
        <Route path="state" element={<State />}></Route>
        <Route path="city" element={<City />}></Route>
        <Route path="taluka" element={<Taluka />}></Route>
        <Route path="form" element={<Form />}></Route>
       </Routes>
       </BrowserRouter>
       </themeContext.Provider>
    </>
)
}



export default App;
