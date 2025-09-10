"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Axios from "app/config/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useParams, useRouter } from "next/navigation";

const Baseurl = process.env.NEXT_PUBLIC_APIURL;

const UpdateOfferLetter = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [currentOfferLetter, setcurrentOfferLetter] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const OfferLetterId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get(
          `${Baseurl}/offer-latter/get-offer-latter-by-id/${OfferLetterId}`,
          {
            authenticated: true, // Only useful if Axios interceptors handle this
          }
        );
        setcurrentOfferLetter(res.data || {});
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    })();
  }, [OfferLetterId]);

  useEffect(() => {
    if (currentOfferLetter) {
      setValue("type", currentOfferLetter.type || "");
      setValue("description", currentOfferLetter.description || "");
      setValue("is_active", currentOfferLetter?.is_active === "inactive");
     

     
    }
  }, [currentOfferLetter, setValue]);

  const onSubmit = async (data) => {
    data.is_active = data.is_active ? "inactive" : "active";
    try {
      setLoading(true);
      const res = await Axios.put(
        `${Baseurl}/offer-latter/update-offer-latter/${OfferLetterId}`,
        data,
        {
          authenticated: true,
        }
      );
      toast.success("Offer Letter updated successfully");
      setLoading(false);
      router.replace("/management/dashboard/offer_letter");
    } catch (error) {
      toast.error(
        data.response.data.message || "An error occurred while updating Offer Letter"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div>
          <h1>Update Intent</h1>
          <Breadcrumb>
            <Link href="/management/dashboard" className="breadcrum-link">
              Dashboard
            </Link>
            <Link
              className="ms-2 breadcrum-link"
              href="/management/dashboard/offer_letter"
            >
              / Offer Letter
            </Link>
            <span className="ms-2">/ Update</span>
          </Breadcrumb>
        </div>
        <div className="dashboard-back-btn">
          <Link
            href="/management/dashboard/offer_letter"
            className="btn btn-outline-primary"
          >
            {" "}
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </Link>
        </div>
      </div>

      <section className="p-5">
        <Row>
         <Col>
                     <div className="dashboard-form-wrapper">
                       <Form onSubmit={handleSubmit(onSubmit)}>
                         <Row>
                           {/* Title */}
                           <Col md={6} className="mb-3">
                             <label className="form-label">Offer Letter Type*</label>
                             <input
                               type="text"
                               className="form-control form-control-sm"
                               {...register("type", {
                                 required: "This field is required",
                               })}
                             />
                             {errors.type && (
                               <span className="text-warning-custom">
                                 {errors.type.message}
                               </span>
                             )}
                           </Col>
         
                           <Col md={6} className="mb-3">
                             <label className="form-label">Description</label>
                             <textarea
                               type="text"
                               className="form-control form-control-sm"
                               {...register("description", {})}
                             />
                             {errors.description && (
                               <span className="text-warning-custom">
                                 {errors.description.message}
                               </span>
                             )}
                           </Col>
         
                           <Col md={6} className="mb-3 d-flex align-items-end">
                             <div className="form-check form-switch ">
                               <input
                                 type="checkbox"
                                 id="click"
                                 className="form-check-input"
                                 {...register("is_active")}
                               />
                               <label
                                 htmlFor="click"
                                 className="form-check-label me-3 px-2"
                               >
                                 Mark as Draft
                               </label>
                             </div>
                           </Col>
                         </Row>
         
                         {/* Submit Button */}
                         <Col className="mt-4">
                           <Button variant="primary" type="submit" disabled={loading}>
                             {loading ? "Submitting..." : "Submit"}
                           </Button>
                         </Col>
                       </Form>
                     </div>
                   </Col>
        </Row>
      </section>
    </>
  );
};

export default UpdateOfferLetter;
