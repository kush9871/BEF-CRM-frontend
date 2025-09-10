// import node module libraries
import React,{ useEffect, useState } from 'react';
import { Col, Row,Container,Form,Button} from 'react-bootstrap';
import { Watch } from 'react-feather';
import { useForm } from 'react-hook-form';
import Axios from 'app/config/axios';
import { useParams } from 'next/navigation';
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_APIURL

const AddressPage = (loggedInUser) => {
  
    const [issameaddress,setIsSameAddress] = useState(false);
    const [loading,setLoading] = useState(false)
    const [userData,setUserData] = useState();
   
 const {
    watch,
    setValue,
    reset,
    register : registerCurrent,
    handleSubmit : handleSubmitCurrent,
    formState: {errors : errorsCurrent}
 } = useForm();

 const currentAddress = watch("address.current")

 const params = useParams();
const userId = params?.id;

 useEffect(() =>{
    if(issameaddress && currentAddress){
        setValue("address.permanent.address" , currentAddress?.address || "") 
        setValue("address.permanent.state" , currentAddress?.state || "") 
        setValue("address.permanent.city" , currentAddress?.city || "") 
        setValue("address.permanent.pincode" , currentAddress?.pincode || "") 
    }else{
        setValue("address.permanent.address" ) 
        setValue("address.permanent.state") 
        setValue("address.permanent.city" ) 
        setValue("address.permanent.pincode") 
    }
   
 },[issameaddress, currentAddress, setValue])

 useEffect(() => {
  const user = loggedInUser?.userData?.userData;
 
  if (user && user.address) {
    setValue("address.current.address", user.address.current?.address || "");
    setValue("address.current.state", user.address.current?.state || "");
    setValue("address.current.city", user.address.current?.city || "");
    setValue("address.current.pincode", user.address.current?.pincode || "");

    setTimeout(() => {
      setValue("address.permanent.address", user.address.permanent?.address || "");
      setValue("address.permanent.state", user.address.permanent?.state || "");
      setValue("address.permanent.city", user.address.permanent?.city || "");
      setValue("address.permanent.pincode", user.address.permanent?.pincode || "");
    }, 100);
  }
}, [loggedInUser, setValue]);

 const onSubmitCurrent = async (data) =>{
  
      
    try{
      setLoading(true)
      if(userId){
         await Axios.put(`${API_URL}/users/update-user/${userId}`,data,{
          authenticated:true
        })
      }else{
          await Axios.put(`${API_URL}/users/update-user`,data,{
          authenticated:true
        })
      }
        toast.success("Address updated successfully")
        setLoading(false)
      }
      catch(error){
       toast.error(error.response.data.message || "An error occurred while updating profile")
       setLoading(false)
      }
     
   

 }




    return (
        <>
        <section className='pt-3'>
       <Container>
        <Row>
            <Col><h3 className='mb-5'>Current Address:-</h3></Col>
            <Form as="form" onSubmit={handleSubmitCurrent(onSubmitCurrent)}>
                <Row>
                  <Col md={6}>
                  <lable>Address</lable>
                  <input
                  type='text'
                  className="form-control form-control-sm mb-2"
                  {...registerCurrent("address.current.address",{
                    required : "This field is required"
                  })}
                  />
                  {errorsCurrent && errorsCurrent?.address?.current?.address && <p className='text-danger'>{errorsCurrent.address.current.address.message}</p>}
                  </Col>
                  <Col md={6}>
                  <label>State</label>
                  <input
                  type='text'
                  className="form-control form-control-sm mb-2"
                  {...registerCurrent("address.current.state",{
                    required: "This field is required"
                  })}
                  />
                  {errorsCurrent && errorsCurrent?.address?.current?.state && <p>{errorsCurrent.address.current.state.message}</p>}
                  </Col>
                  <Col md={6}>
                  <label>City</label>
                  <input 
                  type='text'
                  className="form-control form-control-sm mb-2"
                  {...registerCurrent("address.current.city",{
                    required : "This field is required"
                  })}
                  />
                  {errorsCurrent && errorsCurrent?.address?.current?.city && <p>{errorsCurrent.address.current.city.message}</p>}
                  </Col>
                  <Col>
                  <label>Pin Code</label>
                  <input 
                  type='text'
                  className='form-control form-control-sm mb-2'
                  {...registerCurrent("address.current.pincode",{
                    required: "This field is required"
                  })}
                  />
                  {errorsCurrent && errorsCurrent?.address?.current?.pincode && <p>{errorsCurrent.address.current.pincode.message}</p>}
                  </Col>
                </Row>
                <Row>
                    <Col className="form-check my-3" >
                    <input className="form-check-input"
                     type="checkbox" value="" 
                     checked={issameaddress} 
                     onChange={() => setIsSameAddress (!issameaddress)} 
                     id="flexCheckDefault"/>
  <label className="form-check-label" for="flexCheckDefault">
    if your current address is permanent adress
  </label>
                    </Col>
                </Row>
                <Row>
                <Col><h3 className='mb-5'>Permanent Address:-</h3></Col>
                </Row>
                <Row>
          <Col md={6}>
          <lable>Address</lable>
          <input
          type='text'
          className="form-control form-control-sm mb-2"
          {...registerCurrent("address.permanent.address",{
            required : "This field is required"
          })}
          />
          {errorsCurrent && errorsCurrent?.address?.permanent?.address && <p className='text-danger'>{errorsCurrent.address.permanent.address.message}</p>}
          </Col>
          <Col md={6}>
          <label>State</label>
          <input
          type='text'
          className="form-control form-control-sm mb-2"
          {...registerCurrent("address.permanent.state",{
            required: "This field is required"
          })}
          />
          {errorsCurrent && errorsCurrent?.address?.permanent?.state && <p>{errorsCurrent.address.permanent.state.message}</p>}
          </Col>
          <Col md={6}>
          <label>City</label>
          <input 
          type='text'
          className="form-control form-control-sm mb-2"
          {...registerCurrent("address.permanent.city",{
            required : "This field is required"
          })}
          />
          {errorsCurrent && errorsCurrent?.address?.permanent?.city && <p>{errorsCurrent.address.permanent.city.message}</p>}
          </Col>
          <Col>
          <label>Pin Code</label>
          <input 
          type='text'
          className='form-control form-control-sm mb-2'
          {...registerCurrent("address.permanent.pincode",{
            required: "This field is required"
          })}
          />
          {errorsCurrent && errorsCurrent?.address?.permanent?.pincode && <p>{errorsCurrent.address.permanent.pincode.message}</p>}
          </Col>
        </Row>
                <Col  className="mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      Submit
                    </Button>
                  </Col>
            </Form>
        </Row>
       </Container>
       </section>
       
</>
    )
}

export default AddressPage