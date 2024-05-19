import React, { useState, useEffect } from "react";
import Welcomepage from "./WelcomePage";
import anggota from "./AboutUs";
import "./styles.css";
import AboutPage from "./AboutPage";
import MainPageGIF from "./foto/MainPageGIF.gif"
import wondindo from "./foto/wondindo.png";
import youtubelogo from "./foto/youtubelogo.png";
import facebooklogo from "./foto/facebooklogo.png";
import instalogo from "./foto/instalogo.png";

export default function Main() {
  const [showNextSegment, setShowNextSegment] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [isTransitioningIn, setIsTransitioningIn] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);

  function Continue() {
    setIsTransitioningOut(true);
    transitionBackground();

    setTimeout(() => {
      setShowNextSegment(true);
    }, 10);

    setTimeout(() => {
      setIsTransitioningIn(true);
    }, 1000);
    setTimeout(() => {
      setIsTransitioningOut(false);
    }, 1200);
  }

  function transitionBackground() {
    let currentColor = 0;
    const targetColor = 255;
    const increment = 5;
    const interval = 10;

    const transition = setInterval(() => {
      if (currentColor >= targetColor) {
        clearInterval(transition);
      } else {
        currentColor += increment;
        document.body.style.backgroundColor = `rgb(${currentColor}, ${currentColor}, ${currentColor})`;
      }
    }, interval);
  }

  return (
    <div>
      <div className={`${isTransitioningOut ? "fade-out" : ""}`}>
        <div
          className={`background-overlay ${
            isTransitioningOut ? "fade-out" : ""
          }`}
        ></div>
        {!showNextSegment && (
          <div
            className={`row ${isTransitioningOut ? "fade-out" : ""}`}
            id="containerMain"
          >
            <div className="col text-center">
              <h3>𝕋𝕙𝕚𝕤 𝕚𝕤</h3>
              <h1 id="bali">
                <b>𝓑 𝓐 𝓛 𝓘</b>
              </h1>
              <div className="mt-4" onClick={() => Continue(Continue)}>
                <button className="btn btn-white px-3 py-1 " id="explore">
                  ｅｘｐｌｏｒｅ
                </button>
              </div>
            </div>
          </div>
        )}
        {showAboutUs && <AboutPage onClose={() => setShowAboutUs(false)} />}
        {showNextSegment && (
          <div
            id="next-segment"
            className={`next-segment ${isTransitioningIn ? "fade-in" : ""}`}
          >
            <div id="navigation" className="">
              <div
                className={`fixed-top p-2 ${
                  isTransitioningIn ? "fade-in" : ""
                }`}
                id="navbar1"
              >
                <h2>
                  <b className="text-light">hēll໐๖คli</b>
                </h2>
                <div className="">
                  <a href="#">Home</a>
                  <a href="#" className="" onClick={() => setShowAboutUs(true)}>
                    About Us
                  </a>
                </div>
              </div>
            </div>
            <div
              className={`bg-white ${isTransitioningIn ? "fade-in" : ""}`}
              id="firstSegment"
            >
              <div
                className="m-0 p-0 bg-white slideshow-container"
                id="cardheader"
              >
                <img
                  className="card-img-top"
                  src={MainPageGIF}
                  alt="Card image cap"
                  id="headerimg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="ps-2 pe-2 pb-2" id="MainBody">
                <Welcomepage />
              </div>
              <div className="bg-black text-white">
                <div className="row p-3">
                  <div className="col m-3">
                    <div className="text-secondary">
                      <p>Tel : 0812345678</p>
                      <p>
                        Address : Jalan Scientia Boulevard Gading, Curug
                        Sangereng, Serpong, Kabupaten Tangerang, Banten 15810
                      </p>
                    </div>
                    <p>Find us at :</p>
                    <div>
                      <a href="https://www.instagram.com/wonderfulindonesia/">
                        <img
                          src={instalogo}
                          alt="insta"
                          id="footerlogo"
                        />
                      </a>
                      <a href="https://www.facebook.com/wonderfulindonesia/">
                        <img
                          src={facebooklogo}
                          alt="facebook"
                          id="footerlogo"
                        />
                      </a>
                      <a href="https://www.youtube.com/@WonderfulIndonesiaOfficial">
                        <img
                          src={youtubelogo}
                          alt="youtube"
                          id="footerlogo"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col m-3">
                    <div className="d-flex justify-content-end">
                      <img
                        src={wondindo}
                        id="wonderful"
                        className=""
                      />
                    </div>
                    <div className="mt-auto d-flex justify-content-end ">
                      <p>Copyright © 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
