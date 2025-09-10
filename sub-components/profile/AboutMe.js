// import node module libraries
import { Col, Row, Card } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import formatDate from 'app/components/formatDate';

const AboutMe = (loggedInUser) => {

      const user= (loggedInUser?.loggedInUser?.userData)
       
    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {/* card */}
            <Card style={{minHeight : "280px"}}>
                {/* card body */}
                <Card.Body>
                    {/* card title */}
                    <Card.Title as="h4">About Me</Card.Title>
                    {/* <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
                    <p className="mt-2 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen disse var ius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
                    </p> */}
                    <Row>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Name</h6>
                            <p className="mb-0">{user?.userData?.name}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Phone </h6>
                            <p className="mb-0">{user?.userData?.contactNo}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Date of Birth </h6>
                            <p className="mb-0">{formatDate(user?.userData?.dob)}</p>
                        </Col>
                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">Email </h6>
                            <p className="mb-0">{user?.userData?.official_email}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AboutMe