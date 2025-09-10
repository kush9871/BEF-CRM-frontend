// import node module libraries
import { Col, Row,Container,Form} from 'react-bootstrap';

const AboutMe = () => {
    return (
       <Container>
        <Row>
            <Form>
                <Row>
                  <Col md={6}>
                  <lable>Address</lable>
                  <input
                  type='text'
                  className="form-control form-control-sm mb-2"
                  {...register()}
                  />
                  </Col>
                </Row>
            </Form>
        </Row>
       </Container>
    )
}

export default AboutMe