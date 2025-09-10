// import node module libraries
import Link from 'next/link';
import { Card, Image } from 'react-bootstrap';

const QualificationsForOverview = (loggedInUser) => {

    const user= (loggedInUser?.loggedInUser?.userData)
    
    return (
        <Card className="mb-4" style={{minHeight : "280px"}}>
            <Card.Body>
                <Card.Title as="h4">Qualification</Card.Title>
        {user?.userData?.qualifications && Array.isArray(user?.userData?.qualifications) && user?.userData?.qualifications.length > 0 ? (
          user?.userData?.qualifications.map((item, index) => {
            return (
              <div key={index} className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <div>
                    <Image
                      src="/images/avatar/dummyImage.png"
                      className="rounded-circle avatar-md"
                      alt="Profile"
                    />
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-1">Qualification: {item?.course_name}</h5>
                    <p className="text-muted mb-0 fs-6">
                      Percentage: {item?.percentage}%
                    </p>
                    {item?.certificate?.url && (
                      <a
                        href={`/${item.certificate.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary d-block mt-1"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              
              </div>
            );
          })
        ) : (
          <p className="text-muted">No qualifications available.</p>
        )}
                
            </Card.Body>
        </Card>
    )
}

export default QualificationsForOverview