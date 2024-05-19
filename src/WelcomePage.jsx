import React, { useState, useEffect, useRef } from "react";
import useIntersectionObserver from "./useIntersectionObserver";
import Googleapi from "./googleapi";
import wisata from "./Destination";
import food from "./Culinary";
import hotel from "./Hotel";
import souvenir from "./Souvenir";
import Googleplaces from "./GooglePlaces";
import GoogleMap2 from "./GMap";
import LiveView from "./LiveViewAPI";
import SouvenirGmap from "./SouvenirGMap";
import pngbali from "./foto/pngbali.png";
import awards1 from "./foto/awards1.png";
import kintamani from "./foto/kintamanidesc.jpg";
import nightlife from "./foto/nightlife.jpg";
import fusion from "./foto/fusion.jpg";
import jimbaranfood from "./foto/jimbaranfood.jpg";
import "./styles.css";

function Welcomepage() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [popupImage, setPopupImage] = useState(null);
  const [selectedWisata, setSelectedWisata] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRate] = useState(null);
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(null);
  const timeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef(null);
  const [observe, unobserve, entries] = useIntersectionObserver({
    threshold: 0.5,
  });

  const elementsRef = useRef([]);

  useEffect(() => {
    elementsRef.current.forEach((element) => observe(element));

    return () => {
      elementsRef.current.forEach((element) => unobserve(element));
    };
  }, [observe, unobserve]);

  useEffect(() => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visibleY");
      } else {
        entry.target.classList.remove("visibleY");
      }
    });
  }, [entries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.5, // Adjust this threshold as needed
      },
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const data = await response.json();
        setExchangeRate(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  const convertToSelectedCurrency = (price) => {
    if (!exchangeRates) return "Loading...";
    if (!selectedCurrency) return "-";
    const rate = exchangeRates[selectedCurrency];
    return (price * rate).toLocaleString();
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const target = document.getElementById("balinese");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const text = document.getElementById("balinese").textContent;
        const duration = text.length * 200;
        document
          .getElementById("balinese")
          .style.setProperty("--typing-duration", `${duration}ms`);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  };

  useEffect(() => {
    if (selectedMenu) {
      const element = document.getElementById(selectedMenu);
      if (element) {
        const navbarHeight =
          document.getElementById("navigation2").offsetHeight;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offset = elementPosition - navbarHeight;

        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });

        setTimeout(() => {
          setSelectedMenu(null);
        }, 1000);
      }
    }
  }, [selectedMenu]);

  const autoScroll = () => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.getBoundingClientRect().width;
      const totalWidth = scrollRef.current.scrollWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollSpeed = (totalWidth - containerWidth) / 800;
      const nextScrollLeft = scrollLeft + scrollSpeed;

      if (nextScrollLeft >= totalWidth / 2) {
        scrollRef.current.scrollTo({
          left: nextScrollLeft - totalWidth / 2,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(autoScroll, 50);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleMenuClick = (menu, event) => {
    event.preventDefault();
    setSelectedMenu(menu);
  };

  const handleImageClick1 = (imgurl) => {
    if (selectedWisata && selectedWisata.imgurl === imgurl) {
      setSelectedWisata(null);
    } else {
      const selected = wisata.find((item) => item.imgurl === imgurl);
      setSelectedWisata(selected);
    }
  };

  const handleImageClick2 = (imgurl) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (popupImage === imgurl) {
      setPopupImage(null);
    } else {
      setPopupImage(imgurl);
      timeoutRef.current = setTimeout(() => {
        setPopupImage(null);
      }, 6000);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 3;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generateWisataCards = () => {
    return wisata.map((item, index) => (
      <div
        className="wisata-item"
        key={index}
        onClick={() => handleImageClick1(item.imgurl)}
      >
        <img src={item.imgurl} alt={item.title} id="wisataimagetext" />
        <div className="wisatatext">
          <h2 className="text-white">{item.title}</h2>
        </div>
        {popupImage === item.imgurl && (
          <div
            className={`wisata-card-details ${popupImage === item.imgurl ? "visible" : ""}`}
          >
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        )}
      </div>
    ));
  };

  const generateFoodCards = () => {
    return food.map((item, index) => (
      <div className="food-item-container m-1 d-flex" key={index}>
        <div
          className="food-item"
          onClick={() => handleImageClick2(item.imgurl)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <img src={item.imgurl} alt={item.title} />
          {popupImage === item.imgurl && (
            <div className="food-card-details visible p-3">
              <h2>{item.title}</h2>
              <p className="text-justify">{item.description}</p>
              <div className="d-flex justify-content-center">
                <LiveView
                  cord={{
                    lat: item.cord.lat,
                    lng: item.cord.lng,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const generateHotelCards = () => {
    return hotel.map((item, index) => {
      const priceInSelectedCurrency = convertToSelectedCurrency(item.price);

      const yellowStars = Math.floor(item.rating);
      const blackStars = 5 - yellowStars;

      let stars = [];
      for (let i = 0; i < yellowStars; i++) {
        stars.push(
          <span key={i} className="star blinking">
            {" "}
            &#9733;
          </span>,
        );
      }
      for (let i = 0; i < blackStars; i++) {
        stars.push(
          <span key={i + yellowStars} className="star blinking">
            {" "}
            &#9734;
          </span>,
        );
      }

      return (
        <div className="hotel-item w-auto h-auto m-2 p-5" key={index}>
          <div className="row">
            <div className="col">
              <h3 className="mb-2">{item.title}</h3>
              <div className="m-4">
                <i className="text-secondary m-2">"{item.description}"</i>
              </div>
              <p>
                <strong>Price per night:</strong> (Approx.{" "}
                {priceInSelectedCurrency} {selectedCurrency})
              </p>
              <div className="rating">
                <p>
                  <strong>Rating:</strong>
                  <div id="stars">{stars}</div>
                </p>
              </div>
            </div>
            <div className="col d-flex justify-content-end">
              <img src={item.imgurl} alt={item.title} />
            </div>
          </div>
        </div>
      );
    });
  };

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
    setSelectedStoreIndex(null);
  };

  const generateSouvenirCard = () => {
    return souvenir.map((category, index) => (
      <div
        className="ccard souvenir-item m-1 p-3"
        key={index}
        onClick={() => handleCategoryClick(index)}
        style={{
          backgroundImage: `url(${category.imgurl})`,
          backgroundSize: "cover",
        }}
      >
        <p>{category.category}</p>
      </div>
    ));
  };

  const handleImageClick3 = (index) => {
    setSelectedStoreIndex(index);
  };

  return (
    <div
      className=""
      id="welcomepage"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div id="navigation2">
        <div id="navbar2">
          <a
            href="#"
            className=""
            onClick={(event) => handleMenuClick("wisata", event)}
          >
            Destination
          </a>
          <a
            href="#"
            className=""
            onClick={(event) => handleMenuClick("makanan", event)}
          >
            Culinary
          </a>
          <a
            href="#"
            className=""
            onClick={(event) => handleMenuClick("hotel", event)}
          >
            Hotels
          </a>
          <a
            href="#"
            className=""
            onClick={(event) => handleMenuClick("souvenir", event)}
          >
            Souvenir
          </a>
        </div>
      </div>

      <div className="row p-3">
        <div className="col-lg-6">
          <h1 className="pt-3 d-flex align-items-center justify-content-start">
            <b>Bali</b>
          </h1>
          <h3 className={isVisible ? "typing" : ""} id="balinese">
            (/ˈbɑːli/; Balinese: ᬩᬮᬶ)
          </h3>
          <p id="kotak1">
            Bali, the island of culture, nature's beauty, and hospitality. Bali
            is famous for its mesmerizing beaches, with contrasting white sands
            and bright blue waters. Not limited to beaches, Bali also offers
            refreshing terraced rice paddy field views, gorgeous highlands, and
            abundant waterfalls. Alongside Bali's most hospitable community,
            HelloBali provides the best reference into creating the ultimate
            atmosphere for any visitors looking to rest and adventure.
          </p>
          <h2 className="pb-2 pt-3 d-flex align-items-center justify-content-end">
            <b>HelloBali</b>
          </h2>
          <p id="kotak1">
            We provide the best reference for your next Bali visit! Find our
            best destinations to explore, ranging from lively night attractions
            to relaxing beaches. Experience authentic local culinary
            destinations, stay at Bali's top resorts, unravel the best of Bali
            in the touch of your fingers!
          </p>
        </div>
        <div className="d-flex col-lg-6 mt-3 justify-content-center align-items-center">
          <button
            id="buttonbali"
            onClick={() => setShowGoogleMap(!showGoogleMap)}
          >
            <img src={pngbali} alt="bali" id="balipng" />
            <p className="text-secondary text-center m-0">
              <i>Click minimap to toggle Google Maps!</i>
            </p>
          </button>
        </div>
        <div>{showGoogleMap && <Googleapi />}</div>
        <br />
      </div>
      <h2 className="text-center mt-3">Featured in Wonderful Indonesia™</h2>
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          className="embed-responsive-item"
          id="embedyoutube"
          src="https://www.youtube.com/embed/qjP4QdZK7tc?si=NzKcemKrFDtQHtWR&autoplay=1&controls=0&rel=0"
          allowFullScreen
        ></iframe>
      </div>
      <div>
        <br />
        <div className="d-flex justify-content-center ms-3 me-3">
          <div
            className={`d-flex justify-content-center ms-3 me-3 ${isVisible ? "visible" : ""}`}
            id="awardsbanner"
            ref={bannerRef}
          >
            <img
              src={awards1}
              alt="awards1"
              id="awardsimg"
              className="pe-3"
            />
            <div className="d-flex flex-column">
              <h6 className="ps-4 pt-3 pe-2">World Travel Awards™</h6>
              <h3 className="ps-4 pb-2 pe-2">30th Nominee Worldwide</h3>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-center mt-5">Your journey starts here!</h2>
      <div className="mt-3 p-3">
        <h2>Hello, from Bali!</h2>
        <div>
          <i className="text-secondary">
            Get to know Bali before your visit! Scroll along to find the best
            destinations for your money.
          </i>
          <div className="left-aligned">
            <p
              className="mt-3 animate-on-scroll"
              id="textalign"
              ref={(el) => (elementsRef.current[0] = el)}
            >
              Bali extends much more than an island; it is a vibrant tapestry of
              rich cultural heritage, breathtaking natural landscapes, and a
              warm, welcoming spirit that captivates. Needless to say, a
              first-timer might get lost in the abundance of options to choose
              from, whether it be{" "}
              <a
                href=""
                onClick={(event) => handleMenuClick("wisata", event)}
                id="aclick"
              >
                popular attractions
              </a>
              ,{" "}
              <a
                href=""
                onClick={(event) => handleMenuClick("makanan", event)}
                id="aclick"
              >
                culinary destinations{" "}
              </a>{" "}
              , or{" "}
              <a
                href=""
                onClick={(event) => handleMenuClick("hotel", event)}
                id="aclick"
              >
                places to stay{" "}
              </a>
              at.
            </p>
          </div>
          <div className="right-aligned">
            <p
              className="animate-on-scroll"
              id="textalign"
              ref={(el) => (elementsRef.current[1] = el)}
            >
              Bali's culture is constantly evolving, impacting tourism and
              enriching travel experiences. As trends and traditions change,
              visitors can enjoy new attractions, innovative cuisine, and modern
              accommodations that blend with Bali's timeless charm. This dynamic
              environment ensures each visit offers something new, making Bali a
              perennial favorite among travelers worldwide
            </p>
          </div>
        </div>
      </div>
      <div id="wisata" style={{ paddingTop: "80px" }}>
        <h2>Destination</h2>
        <p className="text-secondary">
          <i>Click images to explore!</i>
        </p>
        <div className="wisata-container">
          <div className="wisata-scroll" ref={scrollRef}>
            {generateWisataCards()}
            {generateWisataCards()}
          </div>

          {selectedWisata && (
            <div
              className="wisata-detail"
              onClick={() => setSelectedWisata(null)}
            >
              <div className="row">
                <div className="col">
                  <img src={selectedWisata.imgurl} alt={selectedWisata.title} />
                  <h3>{selectedWisata.title}</h3>
                  <p>{selectedWisata.description}</p>
                </div>
                <div className="col">
                  <GoogleMap2
                    center={{
                      lat: selectedWisata.cord.lat,
                      lng: selectedWisata.cord.lng,
                    }}
                    zoom={selectedWisata.zoom}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 transparent-content">
          <div
            className="d-flex justify-content-between animate-on-scroll mb-3 "
            id="yapcontent1"
            ref={(el) => (elementsRef.current[2] = el)}
          >
            <p id="content1">
              Not only famous for its beaches and sunsets, Bali also holds one
              of the most breathtaking highlands and mountains.
            </p>
            <div className="me-3" id="yapimage1">
              <img
                src={kintamani}
                alt="kintamani"
                id="imgdestination1"
              />
              <div className="text-end">
                <i className="text-secondary">Kintamani</i>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-between animate-on-scroll mb-3"
            id="yapcontent2"
            ref={(el) => (elementsRef.current[3] = el)}
          >
            <div className="me-3">
              <img
                src={nightlife}
                alt="nightlife"
                id="imgdestination2"
              />
              <i className="text-secondary">Bali Nightlife</i>
            </div>
            <p id="content2">
              For those who prefer warmer and tropical weathers, look no further
              than the south. You will find plenty of beaches near the airport,
              however it is recommended to visit at lesser busy hours to avoid
              crowds.
            </p>
          </div>
          <h4
            id="content3"
            className="pb-5 animate-on-scroll"
            ref={(el) => (elementsRef.current[4] = el)}
          >
            Famous for its nightlife, most of Bali's major areas are guaranteed
            to make you stay up late.{" "}
            <h6>P.S: In our experiences, Ubud offers great atmosphere.</h6>
          </h4>
          <div id="content4">
            <p>
              -- For the best experience, Nusa Dua is your best bet.
              Strategically located, Nusa Dua is just beside Bali's only Mandara
              Toll Road, with less than 30 minutes time to take you to the
              airport and Denpasar. With plenty of luxurious hotels, Nusa Dua is
              mostly self-contained, almost like it's its own complex. If you
              prefer exclusivity, Nusa Dua is the way to go. Price for
              everything is significantly higher in establishments, but you get
              what you pay for in quality service.
            </p>
            <h3>
              <i>"Nusa Dua is the key. Nusa Dua is the way."</i>
            </h3>
          </div>
        </div>
      </div>

      <div id="makanan" className="" style={{ paddingTop: "0" }}>
        <h2>Culinary</h2>
        <p className="text-secondary">
          <i>Click images find out more!</i>
        </p>
        <div>
          <div className="d-flex flex-wrap justify-content-center align-self-center">
            {generateFoodCards()}
          </div>
          <div className="p-3">
            <div
              className="d-flex justify-content-between mb-3 animate-on-scroll"
              id="yapcontent1"
              ref={(el) => (elementsRef.current[5] = el)}
            >
              <p id="content1">
                Bali boasts an incredible selection of culinary delights,
                reflecting its rich cultural heritage and diverse influences.
                Bali offers traditional to international fusion dishes for you
                to try out.
              </p>
              <div className="me-3" id="yapimage1">
                <img src={fusion} id="imgdestination1" />
                <div className="text-end">
                  <i className="text-secondary">Balinese Fusion</i>
                </div>
              </div>
            </div>
            <div
              className="d-flex justify-content-between  mb-3 animate-on-scroll"
              id="yapcontent2"
              ref={(el) => (elementsRef.current[6] = el)}
            >
              <div className="me-3">
                <img
                  src={jimbaranfood}
                  alt="jimbaran"
                  id="imgdestination2"
                />
                <i className="text-secondary">Jimbaran</i>
              </div>
              <p id="content2">
                To satisfy your seafood cravings, Jimbaran holds plenty of
                choices to choose from. From seaside bars to grills, it has it
                all. Jimbaran is located just south of the airport and is very
                accessible. Depending on the establishment you choose, expect to
                pay average money, since locals also visit, price isn't your
                concern. influences
              </p>
            </div>
            <div
              className="animate-on-scroll"
              ref={(el) => (elementsRef.current[7] = el)}
            >
              <p id="foodcontent" className="pb-5">
                Bali also embraces international cuisine with flair. Ubud, for
                instance, offers a plethora of vegetarian and vegan options,
                including innovative raw food dishes and organic cafes.
                Meanwhile, Seminyak and Canggu are renowned for their trendy
                beachfront restaurants and chic cafes, serving up everything
                from gourmet burgers to sushi burritos.
              </p>
              <h5 id="content4">
                <i>
                  "Southern Bali is where most of the culinary world happen.
                  Look for variety when visiting Bali, experience what the
                  locals eat and enjoy international fusion dishes."
                </i>
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div id="hotel" className="mt-5" style={{ paddingTop: "80px" }}>
        <h2>Hotels</h2>
        <p className="text-secondary">
          <i>Our Hotel Recommendations in Bali!</i>
        </p>
        <div className="currency-dropdown">
          <label htmlFor="currency">Select Currency: </label>
          <select
            className="form-select"
            id="currency"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
          >
            <option value="USD">USD</option>
            <option value="IDR">IDR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div id="hotelcards" className="p-2">
          {generateHotelCards()}
        </div>
      </div>
      <div>
        <Googleplaces />
      </div>

      <div id="souvenir" className="mt-5" style={{ paddingTop: "80px" }}>
        <h2>Souvenir</h2>
        <p className="text-secondary">
          <i>Click images to find out more!</i>
        </p>
        <div className="">
          <div className="d-flex flex-wrap justify-content-center align-self-center">
            {generateSouvenirCard()}
          </div>
        </div>
        {selectedCategoryIndex !== null && (
          <div
            className={`souvenir-card-details ${selectedCategoryIndex !== null ? "visible" : ""}`}
            style={{ width: "100%", textAlign: "center" }}
          >
            <h2>{souvenir[selectedCategoryIndex].category}</h2>
            <i className="text-secondary">Click to view description!</i>
            <div className="souvenir-scroll">
              {souvenir[selectedCategoryIndex].stores.map((store, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <img
                    src={store.imgurl}
                    alt={store.name}
                    id="souvenirimg"
                    onClick={() => handleImageClick3(index)}
                  />
                </div>
              ))}
            </div>
            {selectedStoreIndex !== null && (
              <div
                className="map-container row"
                style={{ width: "100%", marginTop: "20px" }}
              >
                <div className="col d-flex flex-column">
                  <h2>
                    {
                      souvenir[selectedCategoryIndex].stores[selectedStoreIndex]
                        .name
                    }
                  </h2>
                  <div></div>
                  <p>
                    {
                      souvenir[selectedCategoryIndex].stores[selectedStoreIndex]
                        .description
                    }
                  </p>
                  <p className="mt-auto">
                    We recommend these stores :{" "}
                    {
                      souvenir[selectedCategoryIndex].stores[selectedStoreIndex]
                        .stores
                    }
                  </p>
                </div>
                <div className="col">
                  <i className="text-secondary text-end">
                    Recommended places :
                  </i>
                  <SouvenirGmap
                    storeName={
                      souvenir[selectedCategoryIndex].stores[selectedStoreIndex]
                        .name
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Welcomepage;
