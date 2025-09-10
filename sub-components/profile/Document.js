import Axios from "app/config/axios";
import { toast } from "react-toastify";
import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "node_modules/next/navigation";

const API_URL = process.env.NEXT_PUBLIC_APIURL;
const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;

const DocumentPage = (loggedInUser) => {
    const params = useParams();
    const userId = params?.id;
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const aadharInputRef = useRef(null);
  const panInputRef = useRef(null);

  const userDocuments = loggedInUser?.userData?.userData?.documents || [];

  const aadharDoc =
    userDocuments.find((doc) => doc.documentType === "aadhar") || null;
  const panDoc =
    userDocuments.find((doc) => doc.documentType === "pan") || null;

  const [aadharPreview, setAadharPreview] = useState(
    `${IMG_URL}/${aadharDoc?.file?.path}` || null
  );
  const [panPreview, setPanPreview] = useState(
    `${IMG_URL}/${panDoc?.file?.path}` || null
  );
  const [documentList, setDocumentList] = useState([]);

  const documentaionhandleClick = (type) => {
    if (type === "aadhar" && aadharInputRef.current) {
      aadharInputRef.current.click();
    }
    if (type === "pan" && panInputRef.current) {
      panInputRef.current.click();
    }
  };

  const documentationhandleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);

      setDocumentList((prevList) => {
        const updatedList = prevList.filter((doc) => doc.documentType !== type);
        return [...updatedList, { documentType: type, file }];
      });

      if (type === "aadhar") {
        setAadharPreview(preview);
        setValue("aadharCard", file);
      } else if (type === "pan") {
        setPanPreview(preview);
        setValue("panCard", file);
      }
    }
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (aadharPreview) URL.revokeObjectURL(aadharPreview);
      if (panPreview) URL.revokeObjectURL(panPreview);
    };
  }, [aadharPreview, panPreview]);

  const documentSubmitHandler = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      documentList.forEach((doc, i) => {
        if (doc.documentType?.trim()) {
          formData.append(`documentsData[${i}].documentType`, doc.documentType);
        }
        if (doc.file instanceof File) {
          formData.append(`documentsData[${i}].file`, doc.file);
        }
      });
      if(userId){
      await Axios.put(`${API_URL}/users/update-user/${userId}`, formData, {
        authenticated: true,
      });
    }else{
        await Axios.put(`${API_URL}/users/update-user/`, formData, {
        authenticated: true,
      });
    }

      toast.success("Document updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while updating Document"
      );
      setLoading(false);
    }
  };

  return (
    <section className="pt-3">
      <Container>
        <Form onSubmit={handleSubmit(documentSubmitHandler)}>
          <Row className="mb-3">
            {/* Aadhar Upload */}
            <Col md={6}>
              <label>Aadhar Card*</label>
              <div
                className="upload-container border text-center"
                style={{
                  cursor: "pointer",
                  background: "#f8f8f8",
                  borderRadius: "5px",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                onClick={() => documentaionhandleClick("aadhar")}
              >
                {aadharPreview ? (
                  <img
                    src={aadharPreview}
                    alt="Aadhar Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "Click to upload AADHAR"
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={aadharInputRef}
                onChange={(e) => documentationhandleFileChange(e, "aadhar")}
                style={{ display: "none" }}
              />

              <input
                type="hidden"
                {...register("aadharCard", {
                  required: "Aadhar card is required",
                })}
              />
              {errors.aadharCard && (
                <p className="text-warning-custom">{errors.aadharCard.message}</p>
              )}
            </Col>

            {/* PAN Upload */}
            <Col md={6}>
              <label>PAN Card*</label>
              <div
                className="upload-container border text-center"
                style={{
                  cursor: "pointer",
                  background: "#f8f8f8",
                  borderRadius: "5px",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                onClick={() => documentaionhandleClick("pan")}
              >
                {panPreview ? (
                  <img
                    src={panPreview}
                    alt="PAN Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "Click to upload PAN"
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={panInputRef}
                onChange={(e) => documentationhandleFileChange(e, "pan")}
                style={{ display: "none" }}
              />

              <input
                type="hidden"
                {...register("panCard", {
                  required: "PAN card is required",
                })}
              />
              {errors.panCard && (
                <p className="text-warning-custom">{errors.panCard.message}</p>
              )}
            </Col>
          </Row>

          <Button type="submit" variant="primary" disabled={loading}>
            Submit
          </Button>
        </Form>
      </Container>
    </section>
  );
};

export default DocumentPage;
