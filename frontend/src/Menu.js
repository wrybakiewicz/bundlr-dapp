import {Link, useLocation} from "react-router-dom";

export default function Menu() {
    const location = useLocation();

    const showActive = (route) => {
        if(location.pathname === route) {
            return "active"
        } else {
            return ""
        }
    }

    return <div className="row">
        <div className="col-12">
            <ul className="nav nav-tabs justify-content-center">
                <li className="nav-item">
                    <Link to={"/"} className={"nav-link " + showActive("/")}>View</Link>
                </li>
                <li className="nav-item">
                    <Link to={"/mint"} className={"nav-link " + showActive("/mint")}>Mint</Link>
                </li>
            </ul>
        </div>
    </div>
}