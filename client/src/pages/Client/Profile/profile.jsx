import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
import Navbar from "../../../components/Navbar/navbar";

import * as Yup from "yup";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import {
  useNavigate,
  useParams,
  useLocation,
  useNavigation,
  createBrowserRouter,
  useNavigationType,
} from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  clearError,
  userProfileByIdThunk,
} from "../../../redux/features/userSlice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Profile = ({ isChecked, handleChange }) => {
  let { id } = useParams();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocation = useRef(location);

  const [userData, setUserData] = useState({});
  const [isMail, setIsMail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [image, setImage] = useState({});
  const [ifImage, setIfImage] = useState(false);
  const [addEmail, setAddEmail] = useState([]);
  const [addPhone, setAddPhone] = useState([]);
  const [addInterest, setAddInterest] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const error = useSelector((state) => state.rootReducer.userInfo.error);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/user/login");
    } else {
      dispatch(userProfileByIdThunk(id)).then((data) => {
        if (data.payload) {
          const userDataFromFirestore = data.payload;
          setUserData(userDataFromFirestore);
          // setAddEmail(userDataFromFirestore.emailList || []);
          // setAddPhone(userDataFromFirestore.phoneList || []);
          setAddInterest(userDataFromFirestore.interest || []);
          setImageUrl(userDataFromFirestore.image || "");
        } else {
          toast.error("No such document!");
          navigate("/user/login");
        }
      });
    }
  }, [id, dispatch, navigate]);

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

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const userProfile = useFormik({
    enableReinitialize: true,
    initialValues: {
      image: imageUrl,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      gender: userData.gender || "",
      interest: addInterest,
      country: userData.country || "",
      email: userData.email,
      phone: userData.phone || "",
      emailList: userData.emailList || [{ email: "" }],
      phoneList: userData.phoneList || [{ phone: "" }],
    },
    validationSchema: Yup.object({
      image: Yup.mixed().required("Required"),
      firstName: Yup.string().required("Firstname required"),
      lastName: Yup.string().required("Lastname required"),
      gender: Yup.string().required("Please select your gender"),
      interest: Yup.array()
        .min(1, "Please select at least one interest")
        .required("Please select your interest"),
      country: Yup.string().required("Please select your country"),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
      phone: Yup.string()
        .matches(phoneRegExp, "Phone number must be 10 digits")
        .min(10, "too short")
        .max(10, "too long")
        .required("Please enter your phone no"),
      emailList: Yup.array().of(
        Yup.object().shape({
          email: Yup.string().email("Invalid email"),
        })
      ),
      phoneList: Yup.array().of(
        Yup.object().shape({
          phone: Yup.string()
            .matches(phoneRegExp, "Phone number must be 10 digits")
            .min(10, "too short")
            .max(10, "too long"),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const profileData = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          interest: values.interest,
          country: values.country,
          phone: values.phone,
          emailList: values.emailList,
          phoneList: values.phoneList,
        };

        console.log(profileData);
        userProfile.setFieldValue("dirty", false);
        if (image instanceof File) {
          if (!storage) {
            throw new Error("Firebase storage is not initialized.");
          }
          const storageRef = ref(storage, `profiles/${id}/${image.name}`);
          const uploadTask = await uploadBytesResumable(storageRef, image);
          const snapshot = await uploadTask;
          const downloadURL = await getDownloadURL(snapshot.ref);
          profileData.image = downloadURL;
        }

        await updateDoc(doc(db, "users", id), profileData);
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    },
  });

  const handleAddonImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIfImage(true);
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      userProfile.setFieldValue("image", file);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (userProfile.dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handleRouteChange = () => {
      if (userProfile.dirty && location !== prevLocation.current) {
        if (
          !window.confirm(
            "You have unsaved changes, do you really want to leave?"
          )
        ) {
          navigate(prevLocation.current.pathname, { replace: true });
        } else {
          userProfile.setFieldTouched();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    handleRouteChange();

    return () => {
      window.addEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location, userProfile.dirty, navigate]);

  useEffect(() => {
    prevLocation.current = location;
  }, [location]);

  return (
    <>
      <ToastContainer />
      <Navbar isChecked={isChecked} handleChange={handleChange} userId={id} />
      <div className="profile-main-container">
        {/* Desktop */}
        <div className="profile-container">
          <div className="profile-header-container">
            <p>{t("MyProfile")}</p>
          </div>
          {/* Desktop */}
          <FormikProvider value={userProfile}>
            <form onSubmit={userProfile.handleSubmit}>
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
                          onChange={handleAddonImage}
                          // onBlur={userProfile.handleBlur}
                          // value={userProfile.values.image}
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
                        {userProfile.touched.image &&
                        userProfile.errors.image ? (
                          <div id="input-errors">
                            {userProfile.errors.image}
                          </div>
                        ) : null}
                      </div>
                      <div className="profile-name-container">
                        <div className="profile-first-name-container">
                          <label htmlFor="firstName">{t("FirstName")}</label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={userProfile.handleChange}
                            onBlur={userProfile.handleBlur}
                            value={userProfile.values.firstName}
                          />
                          {userProfile.touched.firstName &&
                          userProfile.errors.firstName ? (
                            <div id="input-errors">
                              {userProfile.errors.firstName}
                            </div>
                          ) : null}
                        </div>
                        <div className="profile-last-name-container">
                          <label htmlFor="lastName">{t("LastName")}</label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={userProfile.handleChange}
                            onBlur={userProfile.handleBlur}
                            value={userProfile.values.lastName}
                          />
                          {userProfile.touched.lastName &&
                          userProfile.errors.lastName ? (
                            <div id="input-errors">
                              {userProfile.errors.lastName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="profile-email-input-outer-container">
                      <label htmlFor="email">{t("Email")}</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        disabled={true}
                        placeholder="Enter your email"
                        onChange={userProfile.handleChange}
                        onBlur={userProfile.handleBlur}
                        value={userProfile.values.email}
                      />
                      {userProfile.touched.email && userProfile.errors.email ? (
                        <div id="input-errors">{userProfile.errors.email}</div>
                      ) : null}
                    </div>

                    <div className="profile-phone-input-outer-container">
                      <label htmlFor="phone">{t("Phone")}</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        minLength={10}
                        placeholder="Enter your phone"
                        onBlur={userProfile.handleBlur}
                        onChange={userProfile.handleChange}
                        value={userProfile.values.phone}
                      />
                      {userProfile.touched.phone && userProfile.errors.phone ? (
                        <div id="input-errors">{userProfile.errors.phone}</div>
                      ) : null}
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
                              onChange={userProfile.handleChange}
                              onBlur={userProfile.handleBlur}
                              value={g}
                              checked={userProfile.values.gender === g}
                            />
                            <label htmlFor={`gender-${g}`}>{g}</label>
                          </div>
                        ))}
                      </div>
                      {userProfile.touched.gender &&
                      userProfile.errors.gender ? (
                        <div id="input-errors">{userProfile.errors.gender}</div>
                      ) : null}
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
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const updatedInterest = isChecked
                                  ? [...userProfile.values.interest, data]
                                  : userProfile.values.interest.filter(
                                      (item) => item !== data
                                    );
                                userProfile.setFieldValue(
                                  "interest",
                                  updatedInterest
                                );
                              }}
                              onBlur={userProfile.handleBlur}
                              checked={userProfile.values.interest.includes(
                                data
                              )}
                            />
                            <label htmlFor={`interest-${key}`}>{data}</label>
                          </div>
                        ))}
                      </div>
                      {userProfile.touched.interest &&
                      userProfile.errors.interest ? (
                        <div id="input-errors">
                          {userProfile.errors.interest}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="profile-right-content-container">
                  <div className="profile-right-content-inner-container">
                    <div className="profile-country-container">
                      <select
                        name="country"
                        id="country"
                        onChange={userProfile.handleChange}
                        onBlur={userProfile.handleBlur}
                        value={userProfile.values.country}
                      >
                        <option disabled selected value="">
                          {t("Select Country")}
                        </option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">UAE</option>
                        <option value="Spain">Spain</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                    <div className="profile-email-phone-container">
                      <div className="profile-email-container">
                        <div
                          className="profile-email-header-container"
                          style={{
                            borderBottomLeftRadius: !isMail ? "0" : "5px",
                            borderBottomRightRadius: !isMail ? "0" : "5px",
                          }}
                          onClick={() => setIsMail(!isMail)}
                        >
                          <p>{t("EmailList")}</p>
                          <div className="profile-email-header-icon-container">
                            {!isMail ? (
                              <RiArrowUpSLine />
                            ) : (
                              <RiArrowDownSLine />
                            )}
                          </div>
                        </div>
                        {!isMail && (
                          <div className="profile-email-content-container">
                            <div className="profile-email-scroll-container">
                              <FieldArray
                                name="emailList"
                                render={(arryHelpers) => (
                                  <>
                                    <div style={{ width: "100%" }}>
                                      {userProfile.values.emailList.map(
                                        (email, idx) => (
                                          <div
                                            key={idx}
                                            className="profile-email-input-container"
                                          >
                                            <div className="profile-email-input-inner-container">
                                              <input
                                                id={`emailList.${idx}.email`}
                                                name={`emailList.${idx}.email`}
                                                type="email"
                                                placeholder="Enter your email"
                                                onBlur={userProfile.handleBlur}
                                                value={email.email}
                                                onChange={
                                                  userProfile.handleChange
                                                }
                                              />
                                              <div
                                                className="profile-email-input-icon-container"
                                                onClick={() =>
                                                  arryHelpers.remove(idx)
                                                }
                                              >
                                                <RxCross2 />
                                              </div>
                                            </div>
                                            {userProfile.touched.emailList &&
                                            userProfile.touched.emailList[
                                              idx
                                            ] &&
                                            userProfile.errors.emailList &&
                                            userProfile.errors.emailList[
                                              idx
                                            ] ? (
                                              <div id="input-errors">
                                                {
                                                  userProfile.errors.emailList[
                                                    idx
                                                  ].email
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div
                                      className="profile-add-email-button-container"
                                      onClick={() =>
                                        arryHelpers.push({ email: "" })
                                      }
                                    >
                                      <p>{t("AddEmail")} +</p>
                                    </div>
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="profile-phone-container">
                        <div
                          className="profile-phone-header-container"
                          style={{
                            borderBottomLeftRadius: !isPhone ? "0" : "5px",
                            borderBottomRightRadius: !isPhone ? "0" : "5px",
                          }}
                          onClick={() => setIsPhone(!isPhone)}
                        >
                          <p>{t("PhoneList")}</p>
                          <div className="profile-phone-header-icon-container">
                            {!isPhone ? (
                              <RiArrowUpSLine />
                            ) : (
                              <RiArrowDownSLine />
                            )}
                          </div>
                        </div>
                        {!isPhone && (
                          <div className="profile-phone-content-container">
                            <div className="profile-phone-scroll-container">
                              <FieldArray
                                name="phoneList"
                                render={(arryHelpers) => (
                                  <>
                                    <div style={{ width: "100%" }}>
                                      {userProfile.values.phoneList.map(
                                        (phone, idx) => (
                                          <div
                                            key={idx}
                                            className="profile-phone-input-container"
                                          >
                                            <div className="profile-phone-input-inner-container">
                                              <input
                                                id={`phoneList.${idx}.phone`}
                                                name={`phoneList.${idx}.phone`}
                                                type="tel"
                                                maxLength={10}
                                                minLength={10}
                                                placeholder="Enter your phone"
                                                onBlur={userProfile.handleBlur}
                                                value={phone.phone}
                                                onChange={
                                                  userProfile.handleChange
                                                }
                                              />
                                              <div
                                                className="profile-phone-input-icon-container"
                                                onClick={() =>
                                                  arryHelpers.remove(idx)
                                                }
                                              >
                                                <RxCross2 />
                                              </div>
                                            </div>
                                            {userProfile.touched.phoneList &&
                                            userProfile.touched.phoneList[
                                              idx
                                            ] &&
                                            userProfile.errors.phoneList &&
                                            userProfile.errors.phoneList[
                                              idx
                                            ] ? (
                                              <div id="input-errors">
                                                {
                                                  userProfile.errors.phoneList[
                                                    idx
                                                  ].phone
                                                }
                                              </div>
                                            ) : null}
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <div
                                      className="profile-add-phone-button-container"
                                      onClick={() =>
                                        arryHelpers.push({ phone: "" })
                                      }
                                    >
                                      <p>{t("AddPhone")} +</p>
                                    </div>
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" onClick={userProfile.handleSubmit}>
                {t("Submit")}
              </button>
            </form>
          </FormikProvider>
        </div>

        {/* Mobile */}
        <div className="profile-mob-container">
          <div className="profile-mob-header-container">
            <p>{t("MyProfile")}</p>
          </div>
          <div className="profile-mob-content-container">
            <FormikProvider value={userProfile}>
              <form onSubmit={userProfile.handleSubmit}>
                <div className="profile-mob-img-container">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleAddonImage}
                    // onBlur={userProfile.handleBlur}
                    // value={userProfile.values.image}
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
                  {userProfile.touched.image && userProfile.errors.image ? (
                    <div id="input-errors">{userProfile.errors.image}</div>
                  ) : null}
                </div>
                <div className="profile-mob-name-container">
                  <div className="profile-mob-firstname-container">
                    <label htmlFor="firstName">{t("FirstName")}</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="firstName"
                      onChange={userProfile.handleChange}
                      onBlur={userProfile.handleBlur}
                      value={userProfile.values.firstName}
                    />
                    {userProfile.touched.firstName &&
                    userProfile.errors.firstName ? (
                      <div id="input-errors">
                        {userProfile.errors.firstName}
                      </div>
                    ) : null}
                  </div>
                  <div className="profile-mob-lastname-container">
                    <label htmlFor="lastName">{t("LastName")}</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="lastName"
                      onChange={userProfile.handleChange}
                      onBlur={userProfile.handleBlur}
                      value={userProfile.values.lastName}
                    />
                    {userProfile.touched.lastName &&
                    userProfile.errors.lastName ? (
                      <div id="input-errors">{userProfile.errors.lastName}</div>
                    ) : null}
                  </div>
                </div>

                <div className="profile-mob-email-input-outer-container">
                  <label htmlFor="email">{t("Email")}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={userProfile.handleChange}
                    onBlur={userProfile.handleBlur}
                    value={userProfile.values.email}
                  />
                  {userProfile.touched.email && userProfile.errors.email ? (
                    <div id="input-errors">{userProfile.errors.email}</div>
                  ) : null}
                </div>

                <div className="profile-mob-phone-input-outer-container">
                  <label htmlFor="phone">{t("Phone")}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="phone"
                    maxLength={10}
                    minLength={10}
                    placeholder="Enter your phone"
                    onBlur={userProfile.handleBlur}
                    value={userProfile.values.phone}
                    onChange={userProfile.handleChange}
                  />
                  {userProfile.touched.phone && userProfile.errors.phone ? (
                    <div id="input-errors">{userProfile.errors.phone}</div>
                  ) : null}
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
                          onChange={userProfile.handleChange}
                          onBlur={userProfile.handleBlur}
                          value={g}
                          checked={userProfile.values.gender === g}
                        />
                        <label htmlFor={`gender-${g}`}>{g}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {userProfile.touched.gender && userProfile.errors.gender ? (
                  <div id="input-errors">{userProfile.errors.gender}</div>
                ) : null}

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
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const updatedInterest = isChecked
                              ? [...userProfile.values.interest, data]
                              : userProfile.values.interest.filter(
                                  (item) => item !== data
                                );
                            userProfile.setFieldValue(
                              "interest",
                              updatedInterest
                            );
                          }}
                          onBlur={userProfile.handleBlur}
                          checked={userProfile.values.interest.includes(data)}
                        />
                        <label htmlFor={`interest-${key}`}>{data}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {userProfile.touched.interest && userProfile.errors.interest ? (
                  <div id="input-errors">{userProfile.errors.interest}</div>
                ) : null}

                <div className="profile-country-container">
                  <select
                    name="country"
                    id="country"
                    onChange={userProfile.handleChange}
                    onBlur={userProfile.handleBlur}
                    value={userProfile.values.country}
                  >
                    <option disabled selected value="">
                      {t("Select Country")}
                    </option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="Singapore">Singapore</option>
                    <option value="UAE">UAE</option>
                    <option value="Spain">Spain</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div className="profile-mob-email-phone-container">
                  <div className="profile-mob-email-container">
                    <div
                      className="profile-mob-email-header-container"
                      style={{
                        borderBottomLeftRadius: !isMail ? "0" : "5px",
                        borderBottomRightRadius: !isMail ? "0" : "5px",
                      }}
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
                          {/* {addEmail.map((data, idx) => (
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
                                onBlur={userProfile.handleBlur}
                                value={data.email}
                                onChange={(e) =>
                                  setAddEmail(
                                    addEmail.map((elm, index) =>
                                      index === idx
                                        ? { email: e.target.value }
                                        : elm
                                    )
                                  )
                                }
                              />
                              <div
                                className="profile-mob-email-input-icon-container"
                                onClick={() =>
                                  setAddEmail(
                                    addEmail.filter(
                                      (elm, index) => idx != index
                                    )
                                  )
                                }
                              >
                                <RxCross2 />
                              </div>
                            </div>
                            {userProfile.touched.email &&
                            userProfile.errors.email ? (
                              <div id="input-errors">
                                {userProfile.errors.email}
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <div
                          className="profile-mob-add-email-button-container"
                          onClick={() =>
                            setAddEmail([...addEmail, { email: "" }])
                          }
                        >
                          <p>{t("AddEmail")} +</p>
                        </div> */}

                          <FieldArray
                            name="emailList"
                            render={(arryHelpers) => (
                              <>
                                <div style={{ width: "100%" }}>
                                  {userProfile.values.emailList.map(
                                    (email, idx) => (
                                      <div
                                        key={idx}
                                        className="profile-mob-email-input-container"
                                      >
                                        <div className="profile-mob-email-input-inner-container">
                                          <input
                                            id={`emailList.${idx}.email`}
                                            name={`emailList.${idx}.email`}
                                            type="email"
                                            placeholder="Enter your email"
                                            onBlur={userProfile.handleBlur}
                                            value={email.email}
                                            onChange={userProfile.handleChange}
                                          />
                                          <div
                                            className="profile-mob-email-input-icon-container"
                                            onClick={() =>
                                              arryHelpers.remove(idx)
                                            }
                                          >
                                            <RxCross2 />
                                          </div>
                                        </div>
                                        {userProfile.touched.emailList &&
                                        userProfile.touched.emailList[idx] &&
                                        userProfile.errors.emailList &&
                                        userProfile.errors.emailList[idx] ? (
                                          <div id="input-errors">
                                            {
                                              userProfile.errors.emailList[idx]
                                                .email
                                            }
                                          </div>
                                        ) : null}
                                      </div>
                                    )
                                  )}
                                </div>
                                <div
                                  className="profile-mob-add-email-button-container"
                                  onClick={() =>
                                    arryHelpers.push({ email: "" })
                                  }
                                >
                                  <p>{t("AddEmail")} +</p>
                                </div>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="profile-mob-phone-container">
                    <div
                      className="profile-mob-phone-header-container"
                      style={{
                        borderBottomLeftRadius: !isPhone ? "0" : "5px",
                        borderBottomRightRadius: !isPhone ? "0" : "5px",
                      }}
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
                          {/* {addPhone.map((data, idx) => (
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
                                maxLength={10}
                                minLength={10}
                                onBlur={userProfile.handleBlur}
                                value={data.phone}
                                onChange={(e) =>
                                  setAddPhone(
                                    addPhone.map((elm, index) =>
                                      index === idx
                                        ? { phone: e.target.value }
                                        : elm
                                    )
                                  )
                                }
                              />
                              <div
                                className="profile-mob-phone-input-icon-container"
                                onClick={() =>
                                  setAddPhone(
                                    addPhone.filter(
                                      (elm, index) => idx != index
                                    )
                                  )
                                }
                              >
                                <RxCross2 />
                              </div>
                            </div>
                            {userProfile.touched.phone &&
                            userProfile.errors.phone ? (
                              <div id="input-errors">
                                {userProfile.errors.phone}
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <div
                          className="profile-mob-add-phone-button-container"
                          onClick={() =>
                            setAddPhone([...addPhone, { phone: "" }])
                          }
                        >
                          <p>{t("AddPhone")} +</p>
                        </div> */}
                          <FieldArray
                            name="phoneList"
                            render={(arryHelpers) => (
                              <>
                                <div style={{ width: "100%" }}>
                                  {userProfile.values.phoneList.map(
                                    (phone, idx) => (
                                      <div
                                        key={idx}
                                        className="profile-mob-phone-input-container"
                                      >
                                        <div className="profile-mob-phone-input-inner-container">
                                          <input
                                            id={`phoneList.${idx}.phone`}
                                            name={`phoneList.${idx}.phone`}
                                            type="tel"
                                            maxLength={10}
                                            minLength={10}
                                            placeholder="Enter your phone"
                                            onBlur={userProfile.handleBlur}
                                            value={phone.phone}
                                            onChange={userProfile.handleChange}
                                          />
                                          <div
                                            className="profile-mob-phone-input-icon-container"
                                            onClick={() =>
                                              arryHelpers.remove(idx)
                                            }
                                          >
                                            <RxCross2 />
                                          </div>
                                        </div>
                                        {userProfile.touched.phoneList &&
                                        userProfile.touched.phoneList[idx] &&
                                        userProfile.errors.phoneList &&
                                        userProfile.errors.phoneList[idx] ? (
                                          <div id="input-errors">
                                            {
                                              userProfile.errors.phoneList[idx]
                                                .phone
                                            }
                                          </div>
                                        ) : null}
                                      </div>
                                    )
                                  )}
                                </div>
                                <div
                                  className="profile-mob-add-phone-button-container"
                                  onClick={() =>
                                    arryHelpers.push({ phone: "" })
                                  }
                                >
                                  <p>{t("AddPhone")} +</p>
                                </div>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-mob-form-submit-container">
                  <button type="submit" onSubmit={userProfile.handleSubmit}>
                    {t("Submit")}
                  </button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
