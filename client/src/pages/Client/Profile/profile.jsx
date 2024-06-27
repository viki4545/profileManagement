import React, { useEffect, useState } from "react";
import "./profile.css";
import Navbar from "../../../components/Navbar/navbar";

import * as Yup from "yup";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import useAuth from "../../../custom-hooks/useAuth";

const Profile = ({ isChecked, handleChange }) => {
  let { id } = useParams();
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

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userDataFromFirestore = docSnap.data();
        setUserData(userDataFromFirestore);
        setAddEmail(userDataFromFirestore.emailList || []);
        setAddPhone(userDataFromFirestore.phoneList || []);
        setAddInterest(userDataFromFirestore.interest || []);
        setImageUrl(userDataFromFirestore.image || "");
      } else {
        toast.error("No such document!");
      }
    };
    fetchDataFromFirestore();
  }, [id]);

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

  console.log(userData);

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
      emailList: addEmail,
      phoneList: addPhone,
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
        .required("Please enter your phone no")
        .matches(phoneRegExp, "Phone no is not valid")
        .min(10, "too short")
        .max(10, "too long"),
    }),
    onSubmit: async (values) => {
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
      if (values.image && typeof values.image !== "string") {
        const storageRef = ref(storage, `profiles/${id}/${values.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, values.image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle progress
          },
          (error) => {
            toast.error("Failed to upload image");
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            profileData.image = downloadURL;

            // Update user profile
            await updateDoc(doc(db, "users", id), profileData);
            toast.success("Profile updated successfully!");
          }
        );
      } else {
        // Update user profile without new image
        await updateDoc(doc(db, "users", id), profileData);
        toast.success("Profile updated successfully!");
      }
    },
  });

  const handleAddonImage = (e) => {
    const file = e.target.files[0];
    setIfImage(true);
    setImageUrl(URL.createObjectURL(file));
    userProfile.setFieldValue("image", file);
  };

  return (
    <>
      <ToastContainer />
      <Navbar isChecked={isChecked} handleChange={handleChange} userId={id} />
      <div className="profile-main-container">
        {/* Desktop */}
        <div className="profile-container">
          <div className="profile-header-container">
            <p>My Profile</p>
          </div>
          {/* Desktop */}
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
                      {userProfile.touched.image && userProfile.errors.image ? (
                        <div id="input-errors">{userProfile.errors.image}</div>
                      ) : null}
                    </div>
                    <div className="profile-name-container">
                      <div className="profile-first-name-container">
                        <label htmlFor="firstName">FirstName</label>
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
                        <label htmlFor="lastName">LastName</label>
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
                    <label htmlFor="email">Email</label>
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
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
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
                      <p>Gender</p>
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
                    {userProfile.touched.gender && userProfile.errors.gender ? (
                      <div id="input-errors">{userProfile.errors.gender}</div>
                    ) : null}
                  </div>
                  <div className="profile-interest-container">
                    <div className="profile-interest-header-container">
                      <p>Interest</p>
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
                            checked={userProfile.values.interest.includes(data)}
                          />
                          <label htmlFor={`interest-${key}`}>{data}</label>
                        </div>
                      ))}
                    </div>
                    {userProfile.touched.interest &&
                    userProfile.errors.interest ? (
                      <div id="input-errors">{userProfile.errors.interest}</div>
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
                        Select Country
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
                        onClick={() => setIsMail(!isMail)}
                      >
                        <p>EmailList</p>
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
                                    className="profile-email-input-icon-container"
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
                              className="profile-add-email-button-container"
                              onClick={() =>
                                setAddEmail([...addEmail, { email: "" }])
                              }
                            >
                              <p>Add Email +</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="profile-phone-container">
                      <div
                        className="profile-phone-header-container"
                        onClick={() => setIsPhone(!isPhone)}
                      >
                        <p>PhoneList</p>
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
                                    className="profile-phone-input-icon-container"
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
                              className="profile-add-phone-button-container"
                              onClick={() =>
                                setAddPhone([...addPhone, { phone: "" }])
                              }
                            >
                              <p>Add Phone +</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Mobile */}
        <div className="profile-mob-container">
          <div className="profile-mob-header-container">
            <p>My Profile</p>
          </div>
          <div className="profile-mob-content-container">
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
                  <label htmlFor="firstName">FirstName</label>
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
                    <div id="input-errors">{userProfile.errors.firstName}</div>
                  ) : null}
                </div>
                <div className="profile-mob-lastname-container">
                  <label htmlFor="lastName">LastName</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="phone"
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
                  <p>Gender</p>
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
                  <p>Interest</p>
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
                    Select Country
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
                    onClick={() => setIsMail(!isMail)}
                  >
                    <p>Email List</p>
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
                          <p>Add Email +</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="profile-mob-phone-container">
                  <div
                    className="profile-mob-phone-header-container"
                    onClick={() => setIsPhone(!isPhone)}
                  >
                    <p>Phone List</p>
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
                          <p>Add Phone +</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-mob-form-submit-container">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
