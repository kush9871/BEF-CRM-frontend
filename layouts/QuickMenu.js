// import node module libraries
import Link from "next/link";
import { Fragment, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import {
  Row,
  Col,
  Image,
  Dropdown,
  ListGroup,
  Button,
  Modal,
} from "react-bootstrap";
import { signOut } from "next-auth/react";

// simple bar scrolling used for notification item scrolling
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// import data files
import NotificationList from "data/Notification";

// import hooks
import useMounted from "hooks/useMounted";
import Axios from "app/config/axios";
import { useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const QuickMenu = () => {
    const calendarRef = useRef(null);
    const router = useRouter();
    const [openModal,setOpenModal] = useState(false);
    const [userPerformance,setUserPerformance] = useState()
    const hasMounted = useMounted();
    const [salary, setSalary] = useState ([]);
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

  const logOutHandler = async () => {
    await signOut({
      redirect: true,
    });
  };

  const Notifications = () => {
    return (
      <SimpleBar style={{ maxHeight: "300px" }}>
        <ListGroup variant="flush">
          {NotificationList.map(function (item, index) {
            return (
              <ListGroup.Item
                className={index === 0 ? "bg-light" : ""}
                key={index}
              >
                <Row>
                  <Col>
                    <Link href="#" className="text-muted">
                      <h5 className=" mb-1">{item.sender}</h5>
                      <p className="mb-0"> {item.message}</p>
                    </Link>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </SimpleBar>
    );
  };

  const QuickMenuDesktop = () => {
    return (
      <>
        <ListGroup
          as="ul"
          bsPrefix="navbar-nav"
          className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
        >
          <Dropdown as="li" className="stopevent">
            {/* <Dropdown.Toggle
              as="a"
              bsPrefix=" "
              id="dropdownNotification"
              className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted"
            >
              <i className="fe fe-bell"></i>
            </Dropdown.Toggle> */}
            <Dropdown.Menu
              className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
              aria-labelledby="dropdownNotification"
              align="end"
              show
            >
              {/* <Dropdown.Item className="mt-3" bsPrefix=" " as="div">
                <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                  <span className="h4 mb-0">Notifications</span>
                  <Link href="/" className="text-muted">
                    <span className="align-middle">
                      <i className="fe fe-settings me-1"></i>
                    </span>
                  </Link>
                </div>
                <Notifications />
                <div className="border-top px-3 pt-3 pb-3">
                  <Link
                    href="/dashboard/notification-history"
                    className="text-link fw-semi-bold"
                  >
                    See all Notifications
                  </Link>
                </div>
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as="li" className="ms-2">
  <Dropdown.Toggle
    as="button" // 👈 Use button for click toggle
    bsPrefix=" "
    className="rounded-circle border-0 bg-transparent"
    id="dropdownUser"
  >
    <div className="avatar avatar-md avatar-indicators avatar-online">
      <Image
        alt="avatar"
        src="/images/user-profile.jpeg"
        className="rounded-circle"
      />
    </div>
  </Dropdown.Toggle>

  <Dropdown.Menu
    className="dropdown-menu dropdown-menu-end"
    align="end"
    aria-labelledby="dropdownUser"
  >
    <Button
      style={{
        background: "#fff",
        padding: "10px 13px",
        color: "#000",
        outline: "transparent",
        border: "none",
      }}
    >
      {/* <Link
        href="/management/dashboard/profile"
        style={{ color: "#000" }}
      >
        <i className="fe fe-user me-1"></i> View Profile
      </Link> */}
    </Button>

    <Button
      onClick={logOutHandler}
      style={{
        background: "#fff",
        padding: "10px 13px",
        color: "#000",
        outline: "transparent",
        border: "none",
      }}
    >
      <i className="fe fe-power me-2"></i> Sign Out
    </Button>
  </Dropdown.Menu>
</Dropdown>

        </ListGroup>
      </>
    );
  };

  return (
    <Fragment>
      <QuickMenuDesktop />
    </Fragment>
  );
};

export default QuickMenu;
