import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import Axios from "app/config/axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_APIURL;

const BankDetailPage = (loggedInUser) => {
  const newData = loggedInUser?.userData?.userData;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("bankDetails.accountHolder", newData?.bankDetails?.accountHolder);
    setValue("bankDetails.accountNumber", newData?.bankDetails?.accountNumber);
    setValue("bankDetails.ifsc", newData?.bankDetails?.ifsc);
    setValue("bankDetails.bankName", newData?.bankDetails?.bankName);
    setValue("bankDetails.branch", newData?.bankDetails?.branch);
  }, [newData, setValue]);

  const params = useParams();
  const userId = params?.id;

  const onSubmit = async (data) => {
    const payload = {
      bankDetails: {
        accountHolder: data?.bankDetails?.accountHolder,
        accountNumber: data?.bankDetails?.accountNumber,
        ifsc: data?.bankDetails?.ifsc,
        bankName: data?.bankDetails?.bankName,
        branch: data?.bankDetails?.branch,
      },
    };

    try {
      setLoading(true);
      if (userId) {
        await Axios.put(`${API_URL}/users/update-user/${userId}`, payload, {
          authenticated: true,
        });
      } else {
        await Axios.put(`${API_URL}/users/update-user`, payload, {
          authenticated: true,
        });
      }
      toast.success("Bank Detail updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-3">
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6}>
                  <label>Account Holder Name*</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    {...register("bankDetails.accountHolder", {
                      required: "Account Holder Name is required",
                    })}
                  />
                  {errors?.bankDetails?.accountHolder && (
                    <p className="text-warning-custom">
                      {errors.bankDetails.accountHolder.message}
                    </p>
                  )}
                </Col>

                <Col md={6}>
                  <label>Account Number*</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    {...register("bankDetails.accountNumber", {
                      required: "Account Number is required",
                    })}
                  />
                  {errors?.bankDetails?.accountNumber && (
                    <p className="text-warning-custom">
                      {errors.bankDetails.accountNumber.message}
                    </p>
                  )}
                </Col>

                <Col md={6}>
                  <label>IFSC Code*</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    {...register("bankDetails.ifsc", {
                      required: "IFSC Code is required",
                    })}
                  />
                  {errors?.bankDetails?.ifsc && (
                    <p className="text-warning-custom">
                      {errors.bankDetails.ifsc.message}
                    </p>
                  )}
                </Col>

                <Col md={6}>
                  <label>Bank Name*</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    {...register("bankDetails.bankName", {
                      required: "Bank Name is required",
                    })}
                  />
                  {errors?.bankDetails?.bankName && (
                    <p className="text-warning-custom">
                      {errors.bankDetails.bankName.message}
                    </p>
                  )}
                </Col>

                <Col md={6}>
                  <label>Branch*</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    {...register("bankDetails.branch", {
                      required: "Branch is required",
                    })}
                  />
                  {errors?.bankDetails?.branch && (
                    <p className="text-warning-custom">
                      {errors.bankDetails.branch.message}
                    </p>
                  )}
                </Col>
              </Row>

              <Col className="mt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BankDetailPage;
