import React, { useEffect, useState } from "react";
import "./userdetails.css";
import Navbar from "../../../components/Navbar/navbar";

import * as Yup from "yup";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import useAuth from "../../../custom-hooks/useAuth";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  getUserByIdThunk,
} from "../../../redux/features/adminSlice/adminSlice";
import { useTranslation } from "react-i18next";

const Userdetails = ({ isChecked, handleChange }) => {
  let { id } = useParams();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [isMail, setIsMail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [image, setImage] = useState({});
  const [ifImage, setIfImage] = useState(false);
  const [addEmail, setAddEmail] = useState([]);
  const [addPhone, setAddPhone] = useState([]);
  const [addInterest, setAddInterest] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isSidebar, setIsSidebar] = useState(false);

  const error = useSelector((state) => state.rootReducer.adminInfo.error);

  const gender = ["Male", "Female", "Others"];

  const interest = [
    "Reading",
    "Writing",
    "Dance",
    "Singing",
    "Podcasting",
    "Art",
    "Yoga",
    "Sports",
    "Others",
  ];

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Failed to fetch user data");
      navigate("/admin/login");
    } else {
      dispatch(getUserByIdThunk(id)).then((data) => {
        if (data.payload) {
          const userDataFromFirestore = data.payload;
          setUserData(userDataFromFirestore);
          setAddEmail(userDataFromFirestore.emailList || []);
          setAddPhone(userDataFromFirestore.phoneList || []);
          setAddInterest(userDataFromFirestore.interest || []);
          setImageUrl(userDataFromFirestore.image || "");
        } else {
          toast.error("No such document!");
        }
      });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <ToastContainer />
      <Adminnavbar
        isChecked={isChecked}
        handleChange={handleChange}
        userId={id}
        handleSidebar={() => setIsSidebar(!isSidebar)}
      />
      {isSidebar && (
        <Adminsidebar handleSidebar={() => setIsSidebar(!isSidebar)} />
      )}
      <div className="profile-main-container">
        {/* Desktop */}
        <div className="profile-container">
          <div className="profile-header-container">
            <p style={{ paddingLeft: "1rem" }}>{t("UserProfile")}</p>
          </div>
          {/* Desktop */}
          <form>
            <div className="profile-content-container">
              <div className="profile-left-content-container">
                <div className="profile-left-content-inner-container">
                  <div className="profile-img-name-container">
                    <div className="profile-image-container">
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        disabled
                      />
                      {ifImage ? (
                        <img
                          id="blog-image-preview"
                          src={imageUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <img
                          id="blog-image-preview"
                          src={imageUrl}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "5px",
                          }}
                        />
                      )}
                    </div>
                    <div className="profile-name-container">
                      <div className="profile-first-name-container">
                        <label htmlFor="firstName">{t("FirstName")}</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={userData.firstName}
                          disabled
                        />
                      </div>
                      <div className="profile-last-name-container">
                        <label htmlFor="lastName">{t("LastName")}</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={userData.lastName}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="profile-email-input-outer-container">
                    <label htmlFor="email">{t("Email")}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      disabled
                    />
                  </div>

                  <div className="profile-phone-input-outer-container">
                    <label htmlFor="phone">{t("Phone")}</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone"
                      value={userData.phone}
                      disabled
                    />
                  </div>

                  <div className="profile-gender-container">
                    <div className="profile-gender-header-container">
                      <p>{t("Gender")}</p>
                    </div>
                    <div className="profile-gender-content-container">
                      {gender?.map((g) => (
                        <div className="profile-gender-content-inner-container">
                          <input
                            id="gender"
                            name="gender"
                            type="radio"
                            value={g}
                            checked={userData.gender === g}
                          />
                          <label htmlFor={`gender-${g}`}>{g}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="profile-interest-container">
                    <div className="profile-interest-header-container">
                      <p>{t("Interest")}</p>
                    </div>
                    <div className="profile-interest-content-container">
                      {interest.map((data, key) => (
                        <div
                          key={key}
                          className="profile-interest-inner-content-container"
                        >
                          <input
                            id={`interest-${key}`}
                            name="interest"
                            type="checkbox"
                            checked={addInterest.includes(data)}
                          />
                          <label htmlFor={`interest-${key}`}>{data}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-right-content-container">
                <div className="profile-right-content-inner-container">
                  <div className="profile-country-container">
                    <label htmlFor="">{t("Country")}</label>
                    <input type="text" name="" id="" value={userData.country} />
                  </div>
                  <div className="profile-email-phone-container">
                    <div className="profile-email-container">
                      <div
                        className="profile-email-header-container"
                        onClick={() => setIsMail(!isMail)}
                      >
                        <p>{t("EmailList")}</p>
                        <div className="profile-email-header-icon-container">
                          {!isMail ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                        </div>
                      </div>
                      {!isMail && (
                        <div className="profile-email-content-container">
                          <div className="profile-email-scroll-container">
                            {addEmail.map((data, idx) => (
                              <div
                                key={idx}
                                className="profile-email-input-container"
                              >
                                <div className="profile-email-input-inner-container">
                                  <input
                                    id={`email-${idx}`}
                                    name={`email-${idx}`}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    disabled
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="profile-phone-container">
                      <div
                        className="profile-phone-header-container"
                        onClick={() => setIsPhone(!isPhone)}
                      >
                        <p>{t("PhoneList")}</p>
                        <div className="profile-phone-header-icon-container">
                          {!isPhone ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                        </div>
                      </div>
                      {!isPhone && (
                        <div className="profile-phone-content-container">
                          <div className="profile-phone-scroll-container">
                            {addPhone.map((data, idx) => (
                              <div
                                key={idx}
                                className="profile-phone-input-container"
                              >
                                <div className="profile-phone-input-inner-container">
                                  <input
                                    id={`phone-${idx}`}
                                    name={`phone-${idx}`}
                                    type="tel"
                                    placeholder="Enter your phone"
                                    value={data.phone}
                                    disabled
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <button type="submit">Submit</button> */}
          </form>
        </div>

        {/* Mobile */}
        <div className="profile-mob-container">
          <div className="profile-mob-header-container">
            <p>My Profile</p>
          </div>
          <div className="profile-mob-content-container">
            <form>
              <div className="profile-mob-img-container">
                <input type="file" name="image" id="image" accept="image/*" />
                {ifImage ? (
                  <img
                    id="blog-image-preview"
                    src={imageUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                    }}
                  />
                ) : (
                  <img
                    id="blog-image-preview"
                    src={imageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </div>
              <div className="profile-mob-name-container">
                <div className="profile-mob-firstname-container">
                  <label htmlFor="firstName">{t("FirstName")}</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    value={userData.firstName}
                    disabled
                  />
                </div>
                <div className="profile-mob-lastname-container">
                  <label htmlFor="lastName">{t("LastName")}</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="lastName"
                    value={userData.lastName}
                    disabled
                  />
                </div>
              </div>

              <div className="profile-mob-email-input-outer-container">
                <label htmlFor="email">{t("Email")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={userData.email}
                  disabled
                />
              </div>

              <div className="profile-mob-phone-input-outer-container">
                <label htmlFor="phone">{t("Phone")}</label>
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="Enter your phone"
                  onChange={userData.handleChange}
                  disabled
                />
              </div>

              <div className="profile-mob-gender-container">
                <div className="profile-mob-gender-header-container">
                  <p>{t("Gender")}</p>
                </div>
                <div className="profile-mob-gender-content-container">
                  {gender?.map((g) => (
                    <div className="profile-mob-gender-content-inner-container">
                      <input
                        id="gender"
                        name="gender"
                        type="radio"
                        value={g}
                        checked={userData.gender === g}
                      />
                      <label htmlFor={`gender-${g}`}>{g}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-mob-interest-container">
                <div className="profile-mob-interest-header-container">
                  <p>{t("Interest")}</p>
                </div>
                <div className="profile-mob-interest-content-container">
                  {interest.map((data, key) => (
                    <div
                      key={key}
                      className="profile-mob-interest-inner-content-container"
                    >
                      <input
                        id={`interest-${key}`}
                        name="interest"
                        type="checkbox"
                        value={data}
                        checked={addInterest.includes(data)}
                      />
                      <label htmlFor={`interest-${key}`}>{data}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-country-container">
                <label htmlFor="">{t("Country")}</label>
                <input type="text" name="" id="" value={userData.country} />
              </div>

              <div className="profile-mob-email-phone-container">
                <div className="profile-mob-email-container">
                  <div
                    className="profile-mob-email-header-container"
                    onClick={() => setIsMail(!isMail)}
                  >
                    <p>{t("EmailList")}</p>
                    <div className="profile-mob-email-header-icon-container">
                      {!isMail ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                  </div>
                  {!isMail && (
                    <div className="profile-mob-email-content-container">
                      <div className="profile-mob-email-scroll-container">
                        {addEmail.map((data, idx) => (
                          <div
                            key={idx}
                            className="profile-mob-email-input-container"
                          >
                            <div className="profile-mob-email-input-inner-container">
                              <input
                                id={`email-${idx}`}
                                name={`email-${idx}`}
                                type="email"
                                placeholder="Enter your email"
                                value={data.email}
                                disabled
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="profile-mob-phone-container">
                  <div
                    className="profile-mob-phone-header-container"
                    onClick={() => setIsPhone(!isPhone)}
                  >
                    <p>{t("PhoneList")}</p>
                    <div className="profile-mob-phone-header-icon-container">
                      {!isPhone ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                    </div>
                  </div>
                  {!isPhone && (
                    <div className="profile-mob-phone-content-container">
                      <div className="profile-mob-phone-scroll-container">
                        {addPhone.map((data, idx) => (
                          <div
                            key={idx}
                            className="profile-mob-phone-input-container"
                          >
                            <div className="profile-mob-phone-input-inner-container">
                              <input
                                id={`phone-${idx}`}
                                name={`phone-${idx}`}
                                type="tel"
                                placeholder="Enter your phone"
                                value={data.phone}
                                disabled
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-mob-form-submit-container">
                {/* <button type="submit">Submit</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userdetails;
