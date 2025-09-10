"use client";

import Axios from "app/config/axios";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const AnnouncementModal = ({ onClose }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getAnnouncement();
  }, []);

  const getAnnouncement = async () => {
    try {
      const res = await Axios.get("/announcement/announcements/today",{
        authenticated: true,
      });

      setAnnouncements(res.data?.data || []);
    } catch (error) {
      console.log("Announcement Error:", error);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
            <h2>Announcement</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {announcements.length > 0 ? (
          <ul className="list-unstyled">
            {announcements.map((item, index) => (
              <li key={index} className="mb-3">
                <h4 className="text-primary">
                  Date: {new Date(item.DOP).toLocaleDateString()}
                </h4>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
                
              </li>
            ))}
          </ul>
        ) : (
          <p>No announcements for today 🎉</p>
        )}
      </Modal.Body>
      
    </Modal>
  );
};

export default AnnouncementModal;
