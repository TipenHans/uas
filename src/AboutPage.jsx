import React from "react";
import anggota from "./AboutUs";
import "./styles.css";

function AboutPage({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="cards-container">
          {anggota.map((member, index) => (
            <div key={index} className="card">
              <img src={member.imgurl} alt={member.name} className="card-img" />
              <div className="card-content">
                <h3>{member.name}</h3>
                <p>NIM: {member.nim}</p>
                <p>
                  IG:{" "}
                  <a
                    href={`https://www.instagram.com/${member.ig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {member.ig}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
