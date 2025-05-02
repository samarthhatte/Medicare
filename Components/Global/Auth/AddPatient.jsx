import React, { useEffect, useState } from "react";

//INTERNAL IMPORT
import { GoClockFill } from "../../ReactICON/index";
import { UPLOAD_IPFS_IMAGE } from "../../../Context/constants";
import Input from "./../Regular/Input";

import { useStateContext } from "../../../Context/index";

const AddPatient = ({ registerDoctors, setAddPatient }) => {
  const { ADD_PATIENTS, setLoader, notifySuccess, notifyError } =
    useStateContext();
  const [doctor, setDoctor] = useState();

  const handleAddPatient = () => {
    const {
      title,
      firstName,
      lastName,
      gender,
      medicalHistory,
      yourAddress,
      mobile,
      emailID,
      birth,
      walletAddress,
      image,
      message,
      city,
    } = patient;
  
    // Regex for validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const walletRegex = /^0x[a-fA-F0-9]{40}$/; // Basic Ethereum wallet format
  
    // Check for required fields
    const requiredFields = {
      title,
      firstName,
      lastName,
      gender,
      medicalHistory,
      yourAddress,
      mobile,
      emailID,
      birth,
      walletAddress,
      image,
      message,
      city,
    };
  
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === "") {
        notifyError(`${key.replace(/([A-Z])/g, ' $1')} is required.`);
        return;
      }
    }
  
    if (!phoneRegex.test(mobile)) {
      notifyError("Invalid mobile number. It should be a 10-digit Indian number starting with 6-9.");
      return;
    }
  
    if (!emailRegex.test(emailID)) {
      notifyError("Invalid email address format.");
      return;
    }
  
    if (!walletRegex.test(walletAddress)) {
      notifyError("Invalid Ethereum wallet address.");
      return;
    }
  
    ADD_PATIENTS(patient);
  };

  const [patient, setPatient] = useState({
    title: "Miss",
    firstName: "",
    lastName: "",
    gender: "",
    medicalHistory: "",
    yourAddress: "",
    mobile: "",
    emailID: "",
    birth: "",
    walletAddress: "",
    image: "",
    message: "",
    city: "",
  });

  const handleImageChange = async (event) => {
    try {
      setLoader(true);
      const file = event.target.files[0];
      if (file) {
        const imgUrl = await UPLOAD_IPFS_IMAGE(file);
        setPatient({ ...patient, image: imgUrl });
        setLoader(false);
        notifySuccess("Image uploaded successfully");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      notifyError("Failed, check your Pinata API Keys");
    }
  };

  const handleChange = (e) => {
    const selectedID = parseInt(e.target.value);
    const doctor = registerDoctors.find((doc) => doc.doctorID === selectedID);
    setDoctor(doctor);
  };

  return (
    <div className="modal " style={{ display: "block" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Add Patient
            </h5>
            <button className="btn-close" onClick={() => setAddPatient(false)} />
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">Title</label>
                    <select
                      onChange={(e) =>
                        setPatient({
                          ...patient,
                          title: e.target.value,
                        })
                      }
                      className="form-control"
                    >
                      <option value="Miss">Miss</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>
                </div>
                <Input
                  name={"First Name"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, firstName: e.target.value })
                  }
                />
                <Input
                  name={"Last Name"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, lastName: e.target.value })
                  }
                />
                <div className="col-xl-6">
                  <div className="form-group">
                    <label className="col-form-label">Gender</label>
                    <select
                      className="form-control"
                      value={patient.gender}
                      onChange={(e) =>
                        setPatient({ ...patient, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <Input
                  name={"Injury/Condition"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, medicalHistory: e.target.value })
                  }
                />
                <Input
                  name={"Phone"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, mobile: e.target.value })
                  }
                />
                <Input
                  name={"Email ID"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, emailID: e.target.value })
                  }
                />
                <Input
                  name={"Date Of Birth"}
                  type={"date"}
                  handleChange={(e) =>
                    setPatient({ ...patient, birth: e.target.value })
                  }
                />
                <Input
                  name={"City"}
                  type={"text"}
                  handleChange={(e) =>
                    setPatient({ ...patient, city: e.target.value })
                  }
                />
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">Address :</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={3}
                      defaultValue={""}
                      onChange={(e) =>
                        setPatient({ ...patient, yourAddress: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="form-group">
                    <label className="col-form-label">Consulting Doctor:</label>
                    <select className="form-control" onChange={handleChange}>
                      <option value="">Select Doctor</option>
                      {registerDoctors?.map((doctor, index) => (
                        <option key={index} value={doctor?.doctorID}>
                          {doctor?.title} {doctor?.firstName}{" "}
                          {doctor?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>{" "}
                <div className="col-xl-6">
                  <div className="form-group">
                    <label className="col-form-label">Upload Profile</label>
                    <input
                      size={16}
                      className="form-control"
                      id="file"
                      onChange={handleImageChange}
                      type="file"
                    />
                  </div>
                </div>{" "}
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">Wallet Address</label>
                    <input
                      size={16}
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setPatient({
                          ...patient,
                          walletAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>{" "}
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">Message:</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea2"
                      rows={3}
                      defaultValue={""}
                      onChange={(e) =>
                        setPatient({ ...patient, message: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={handleAddPatient}
              className="btn btn-primary"
            >
              Add Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;