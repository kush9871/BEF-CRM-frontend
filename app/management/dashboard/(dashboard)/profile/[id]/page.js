'use client'
// import node module libraries
import { Col, Row, Container } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

// import widget as custom components
import { PageHeading } from 'widgets';
import {useParams} from "next/navigation";

// import sub components
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  RecentFromBlog
} from 'sub-components'
import { useEffect, useState } from 'react';
import Axios from 'app/config/axios';
const API_URL = process.env.NEXT_PUBLIC_APIURL

const Profile = () => {
  const [userData,setUserData] = useState()
  
  const params = useParams();

  useEffect(()=>{
    getProfile()
  },[])
    

  const getProfile = async()=>{
           try{
           const res = await Axios.get(`${API_URL}/users/get-user-by-id/${params.id}`,{
            authenticated:true
           });
           
           setUserData(res.data.result)
         }catch(error){
           console.error(error,"error")
         }
        }

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Overview"/>

      {/* Profile Header  */}
      <ProfileHeader userData={userData}/>

    </Container>
  )
}

export default Profile