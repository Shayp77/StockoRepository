import { Link } from "react-router-dom"
import '../Styles/navbar.css'
import pngegg from "../Pictures/pngegg.png"
export const Title = () =>
{
  return (
    <div>

      <div className="divtitle">
        <img className="logo" src={pngegg} alt="Lambang Stocko"></img>
        <Link className="title" to="/">Stocko</Link>

      </div>
    </div>

  )
}