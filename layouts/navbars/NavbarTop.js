// import node module libraries
import { Menu } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Nav, Navbar } from 'react-bootstrap';

// import sub components
import QuickMenu from 'layouts/QuickMenu';

// import CSS
import styles from '../../styles/NavbarTop.module.css';
import Axios from 'app/config/axios';

const NavbarTop = (props) => {
  const [birthdayUser, setBirthdayUser] = useState([]);
  const [announcement, setAnnouncement] = useState([]);

  useEffect(() => {
    getBirthdayUsers();
    getAnnouncement();
  }, []);

  const getBirthdayUsers = async () => {
    try {
      const res = await Axios.get("/users/get-users-birthday", { authenticated: true });
      setBirthdayUser(res.data?.birthdayUsers || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAnnouncement = async () => {
  try {
    const res = await Axios.get("/announcement/announcements/today", { authenticated: true });
    setAnnouncement(res.data?.data || []);   // ✅ Correct key
  } catch (error) {
    console.log("Announcement Error:", error);
  }
};


  return (
    <Navbar expanded="lg" className="navbar-classic navbar navbar-expand-lg">
      <div className="d-flex justify-content-between w-100 align-items-center">
        {/* Sidebar Toggle */}
        <div className="d-flex align-items-center">
          <Link
            href="#"
            id="nav-toggle"
            className="nav-icon me-2 icon-xs"
            onClick={() => props.data.SidebarToggleMenu(!props.data.showMenu)}
          >
            <Menu size="18px" />
          </Link>
        </div>

        {/* 🎂 Birthday Marquee */}
        {/* 🎉 Birthday + 📢 Announcement Marquee in one row */}
{(birthdayUser.length > 0 || announcement.length > 0) && (
  <div className={`${styles.marquee} flex-grow-1 mx-3`}>
    <div className={styles.marqueeContent}>
      {/* Birthdays */}
      {birthdayUser.map((item, index) => (
        <span key={`b-${index}`} className="me-5">
          🎉 Wish you a Happy Birthday {item.name} 🎂🎈
        </span>
      ))}

      {/* Announcements */}
      {announcement.map((item, index) => (
        <span key={`a-${index}`} className="me-5">
       📢 Announcement :-  {item.title}
        </span>
      ))}
    </div>
  </div>
)}


        {/* Quick Menu */}
        <Nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap">
          <QuickMenu />
        </Nav>
      </div>
    </Navbar>
  );
};

export default NavbarTop;
