'use client'
// import node module libraries
import { Col, Row, Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'

// import sub components
import AddressForOverview from './AddressForOverview';
import BankDetailsForOverview from './BankDetailsForOverview';
import QualificationsForOverview from './QualificationsForOverview';
import AboutMe from './AboutMe';

const UserOverview = (loggedInUser) => {
  return (
    <section className='pt-3'>
      <Container fluid >

<div >
  <Row>

    {/* About Me */}
    <AboutMe loggedInUser={loggedInUser}/>

    {/* Projects Contributions */}
    <AddressForOverview loggedInUser={loggedInUser}/>

    {/* Recent From Blog */}
    <BankDetailsForOverview loggedInUser={loggedInUser} />

    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">

      {/* My Team */}
      <QualificationsForOverview loggedInUser={loggedInUser}/>

      

    </Col>
  </Row>
</div>


</Container>
    </section>
    
  )
}

export default UserOverview