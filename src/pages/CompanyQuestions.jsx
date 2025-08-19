// src/pages/CompanyQuestions.jsx
import React, { useState } from 'react';
import '../styles/CompanyQuestions.css';
import metaLogo from "../assets/meta.png"
import intelLogo from "../assets/intel.jpg"
import adobeLogo from "../assets/adobe.png"
import qual from "../assets/qual.png"
import hp from "../assets/hp.png"
import sony from "../assets/sony.png"

const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", logo: metaLogo },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Adobe", logo: adobeLogo },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Intel", logo: intelLogo },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  
  { name: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
  { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
  
  { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" },
  { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
  { name: "Twitter (X)", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" },
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
  { name: "SpaceX", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg" },
  { name: "Qualcomm", logo: qual },
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg" },
  { name: "HP", logo: hp},
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Sony", logo: sony },
  { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
  { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
  
  { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" },
  
];

// Dummy questions per company
const dummyQuestions = {
  Google: [
    "Explain the PageRank algorithm.",
    "How would you design Google Docs?",
    "What is a Trie and where is it used?",
  ],
  Microsoft: [
    "What is the difference between Windows and Linux architecture?",
    "Explain COM components.",
    "How does memory management work in .NET?",
  ],
  Amazon: [
    "Explain how you’d design an online bookstore.",
    "What is the CAP theorem?",
    "How would you optimize product recommendation?",
  ],
  Meta: [
    "How does Facebook scale their backend?",
    "Explain GraphQL vs REST.",
    "How would you detect fake accounts?",
  ],
  Apple: [
    "What is the difference between iOS and macOS memory models?",
    "Explain how Swift handles optionals.",
    "Describe how to optimize UI in Apple devices.",
  ],
  Netflix: [
    "How does Netflix use microservices?",
    "Explain how video streaming is optimized.",
    "What is chaos engineering?",
  ],
  Adobe: [
    "How would you design a Photoshop-like app?",
    "What is raster vs vector graphics?",
    "Explain how PDF compression works.",
  ],
  IBM: [
    "Describe IBM Watson’s architecture.",
    "What is quantum computing?",
    "Explain the mainframe architecture.",
  ],
  Intel: [
    "What are instruction sets?",
    "How does a CPU pipeline work?",
    "Explain cache coherence in multicore CPUs.",
  ],
  Oracle: [
    "What is Oracle RAC?",
    "Explain PL/SQL vs SQL.",
    "How does Oracle handle transaction logs?",
  ],
  Salesforce: [
    "Explain multi-tenant architecture in Salesforce.",
    "What are triggers in Apex?",
    "How does Salesforce handle large-scale data?",
  ],
  SAP: [
    "What is SAP HANA?",
    "Explain difference between SAP ERP and SAP S/4HANA.",
    "How does SAP integrate with cloud services?",
  ],
  Uber: [
    "Design the Uber ride-matching system.",
    "How does surge pricing work?",
    "Explain real-time tracking in Uber.",
  ],
  Lyft: [
    "How does Lyft optimize ride allocation?",
    "Explain Lyft Line (ride-sharing).",
    "How would you scale Lyft’s backend?",
  ],
  Airbnb: [
    "How does Airbnb handle host-guest matching?",
    "Explain trust and safety systems at Airbnb.",
    "How to optimize pricing for hosts?",
  ],
  Spotify: [
    "How does Spotify recommend songs?",
    "Explain distributed storage for music streaming.",
    "How does Spotify handle offline caching?",
  ],
  "Twitter (X)": [
    "How does Twitter handle trending topics?",
    "Explain distributed timeline generation.",
    "How does Twitter prevent spam bots?",
  ],
  Tesla: [
    "Explain autopilot system design.",
    "How does Tesla OTA update work?",
    "What is regenerative braking?",
  ],
  SpaceX: [
    "Explain Falcon 9 reusability technology.",
    "How does SpaceX handle launch telemetry?",
    "What are Starlink’s technical challenges?",
  ],
  Qualcomm: [
    "What are Snapdragon processors?",
    "Explain 5G modem design.",
    "How does Qualcomm handle chip fabrication?",
  ],
  Cisco: [
    "Explain difference between router and switch.",
    "What is BGP and how does it work?",
    "How does Cisco handle enterprise networking?",
  ],
  HP: [
    "How does HP optimize printer drivers?",
    "What is HP’s role in cloud computing?",
    "Explain HP hardware lifecycle management.",
  ],
  Dell: [
    "Explain virtualization with Dell servers.",
    "How does Dell handle enterprise storage?",
    "Describe Dell’s role in hybrid cloud.",
  ],
  Samsung: [
    "Explain Samsung’s semiconductor manufacturing.",
    "How does Samsung optimize AMOLED displays?",
    "What is One UI in Android?",
  ],
  Sony: [
    "How does Sony optimize PlayStation architecture?",
    "Explain image sensor technology.",
    "What is Sony’s role in entertainment tech?",
  ],
  NVIDIA: [
    "Explain CUDA architecture.",
    "What are tensor cores?",
    "How does NVIDIA optimize GPUs for AI?",
  ],
  PayPal: [
    "Explain payment gateway flow.",
    "How does PayPal handle fraud detection?",
    "What is tokenization in payments?",
  ],
  Stripe: [
    "Explain Stripe’s API-first approach.",
    "How does Stripe handle subscriptions?",
    "What is PCI compliance?",
  ],
  LinkedIn: [
    "How does LinkedIn handle profile recommendations?",
    "Explain LinkedIn’s job-matching algorithm.",
    "How to optimize LinkedIn feeds?",
  ],
  Dropbox: [
    "Explain distributed file synchronization.",
    "How does Dropbox handle file versioning?",
    "What is delta sync in Dropbox?",
  ],
};

const CompanyQuestions = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const openModal = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="company-container">
      <h2>Top Company Questions</h2>
      <div className="company-grid">
        {companies.map((company, index) => (
          <div
            key={index}
            className="company-card"
            onClick={() => openModal(company.name)}
          >
            <img src={company.logo} alt={company.name} />
            <h3>{company.name}</h3>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCompany} Interview Questions</h2>
            <ul>
              {dummyQuestions[selectedCompany]?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyQuestions;
