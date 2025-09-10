'use client';

import Link from 'next/link';
import { Col, Row, Image, Button } from 'react-bootstrap';
import { useState } from 'react';
import Userprofile from './UserProfile';
import UserOverview from './Overview';
import AddressPage from "./Address";
import QualificationPage from "./Qualification";
import BankDetailPage from "./BankDetail";
import DocumentPage from "./Document";

// Profile header with tabs
const ProfileHeader = (userData) => {
  const [activeTab, setActiveTab] = useState('overview');
  const renderTabContent = () => {
  switch (activeTab) {
    case 'overview':
      return <UserOverview userData={userData}/>; 
    case 'User Profile':
      return <Userprofile userData={userData}/>;
    case 'address':
      return <AddressPage userData={userData} />;
    case 'qualification':
      return <QualificationPage userData={userData}/>;
    case 'document':
      return <DocumentPage userData={userData}/>;
    case 'bank details':
      return <BankDetailPage userData={userData}/>;
    default:
      return <UserOverview userData={userData}/>;
  }
};


  return (
    <Row className="align-items-center">
      <Col xl={12}>
        <div
          className="pt-20 rounded-top"
          style={{
            background: '#0e3862',
            backgroundSize: 'cover',
          }}
        ></div>
       {/* {activeTab && activeTab == "overview" && } */}
        <div className="bg-white rounded-bottom smooth-shadow-sm">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image
                  src="/images/avatar/dummyImage.png"
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt=""
                />
              </div>
              <div className="lh-1">
                <h2 className="mb-0">{userData?.userData?.name || ""}</h2>
                <p className="mb-0 d-block">{userData?.userData?.username || ""}</p>
              </div>
            </div>
          </div>

          <ul className="nav nav-lt-tab px-4" role="tablist">
            {['overview', 'User Profile', 'address', 'document', 'qualification', 'bank details'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="p-4">{renderTabContent()}</div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
