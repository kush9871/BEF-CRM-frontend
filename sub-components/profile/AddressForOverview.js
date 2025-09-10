// import node module libraries
import React from "react";
import Link from 'next/link';
import { Col, Card, Dropdown, Image,Row } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import formatDate from 'app/components/formatDate';
// import required data files
import ProjectsContributionsData from 'data/profile/ProjectsContributionsData';

const AddressForOverview = (loggedInUser) => {

    const user= (loggedInUser?.loggedInUser?.userData)
    
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* card */}
            <Card style={{minHeight : "280px"}}>
                {/* card body */}
                <Card.Body>
                    {/* card title */}
                    <Card.Title as="h4">Address</Card.Title>
                    {/* <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
                    <p className="mt-2 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen disse var ius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
                    </p> */}
                    <Row>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Address</h6>
                            <p className="mb-0">{user?.userData?.address?.current?.address}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">City</h6>
                            <p className="mb-0">{user?.userData?.address?.current?.city}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Pincode</h6>
                            <p className="mb-0">{user?.userData?.address?.current?.pincode}</p>
                        </Col>
                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">State</h6>
                            <p className="mb-0">{user?.userData?.address?.current?.state}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AddressForOverview