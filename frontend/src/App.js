import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import ViewImages from "./ViewImages";
import UploadImage from "./UploadImage";

export default function App() {
    return <BrowserRouter>
        <div className="container p-4">
            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs justify-content-center">
                        <li className="nav-item">
                            <Link to={"/"} className={"nav-link active"}>View</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/mint"} className={"nav-link"}>Mint</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<ViewImages/>}/>
                <Route path="/mint" element={<UploadImage/>}/>
            </Routes>
        </div>
    </BrowserRouter>
}