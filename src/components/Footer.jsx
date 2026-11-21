import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <div className="footer-top container">
                <div className="row">
                    <div className="col-12 col-md-4 footer-col">
                        <h6>GET HELP</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/search?k=nike">Nike</Link></li>
                            <li><Link to="/search?k=adidas">Adidas</Link></li>
                            <li><Link to="/">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-4 footer-col">
                        <h6>SUPPORT</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/">About</Link></li>
                            <li><Link to="/">Contact</Link></li>
                            <li><Link to="/">Help</Link></li>
                            <li><Link to="/">Phone</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-4 footer-col">
                        <h6>REGISTER</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom text-center">
                © 2022 Cybersoft All Rights Reserved | Design Theme by Trương Tấn Khải.
            </div>
        </footer>
    )
}

export default Footer
