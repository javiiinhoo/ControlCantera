import React from "react";
import CustomNavbar from "../components/CustomNavbar";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import WelcomeMessage from "../components/WelcomeMessage";
import '../static/css/Index.module.css';
import 'jquery-ui';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
function Index() {

    return (
        <div>
            <CustomNavbar />
            <WelcomeMessage />
            <Gallery />
            <div className="row">
                <div className="col-md-12 text-center">
                    <p className="mb-0">{Math.floor((new Date() - new Date(1906, 2, 2)) / (1000 * 60 * 60 * 24))} días desde su fundación. </p>
                    <p className="mb-0">Forza Dépor!</p>
                </div>
            </div>
            <Footer />
        </div>

    )
};
export default Index;
