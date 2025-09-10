// import node module libraries
import React from "react";
import Link from 'next/link';
import { MoreVertical } from 'react-feather';
import { Col, Row, Card, Form, Dropdown, Image, Button } from 'react-bootstrap';

const BankDetailsForOverview = (loggedInUser) => {

  const user= (loggedInUser?.loggedInUser?.userData)

  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
    {/* card */}
    <Card style={{minHeight : "280px"}}>
        {/* card body */}
        <Card.Body>
            {/* card title */}
            <Card.Title as="h4">Bank Details</Card.Title>
            {/* <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
            <p className="mt-2 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen disse var ius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
            </p> */}
            <Row>
                <Col xs={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Account Holder</h6>
                    <p className="mb-0">{user?.userData?.bankDetails?.accountHolder}</p>
                </Col>
                <Col xs={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Account Number</h6>
                    <p className="mb-0">{user?.userData?.bankDetails?.accountNumber}</p>
                </Col>
                <Col xs={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Bank Name</h6>
                    <p className="mb-0">{user?.userData?.bankDetails?.bankName}</p>
                </Col>
                <Col xs={6}>
                    <h6 className="text-uppercase fs-5 ls-2">Branch</h6>
                    <p className="mb-0">{user?.userData?.bankDetails?.branch}</p>
                </Col>
                <Col xs={6}>
                    <h6 className="text-uppercase fs-5 ls-2">Ifsc Code</h6>
                    <p className="mb-0">{user?.userData?.bankDetails?.ifsc}</p>
                </Col>
            </Row>
        </Card.Body>
    </Card>
</Col>
  )
}

export default BankDetailsForOverview