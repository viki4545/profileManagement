import React, { useState } from "react";
import "./profile.css";
import Navbar from "../../../components/Navbar/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

const Profile = ({ isChecked, handleChange }) => {
  const [isMail, setIsMail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [addEmail, setAddEmail] = useState([]);
  const [addPhone, setAddPhone] = useState([]);

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

  //   const phoneRegExp =
  //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
    }),
  });
  return (
    <>
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="profile-main-container">
        {/* Desktop */}
        <div className="profile-container">
          <div className="profile-header-container">
            <p>My Profile</p>
          </div>
          {/* Desktop */}
          <form onSubmit={formik.handleSubmit}>
            <div className="profile-content-container">
              <div className="profile-left-content-container">
                <div className="profile-img-name-container">
                  <div className="profile-image-container">
                    <img src="" alt="" srcset="" />
                  </div>
                  <div className="profile-name-container">
                    <div className="profile-first-name-container">
                      <label htmlFor="firstName">FirstName</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="firstName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div id="input-errors">{formik.errors.firstName}</div>
                      ) : null}
                    </div>
                    <div className="profile-last-name-container">
                      <label htmlFor="lastName">LastName</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="lastName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div id="input-errors">{formik.errors.lastName}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="profile-gender-container">
                  <div className="profile-gender-header-container">
                    <p>Gender</p>
                  </div>
                  <div className="profile-gender-content-container">
                    {gender?.map((data, key) => (
                      <div className="profile-gender-content-inner-container">
                        <input
                          id="gender"
                          name="gender"
                          type="radio"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={data}
                        />
                        <label htmlFor="gender">{data}</label>
                      </div>
                    ))}
                  </div>
                  {formik.touched.gender && formik.errors.gender ? (
                    <div id="input-errors">{formik.errors.gender}</div>
                  ) : null}
                </div>
                <div className="profile-interest-container">
                  <div className="profile-interest-header-container">
                    <p>Interest</p>
                  </div>
                  <div className="profile-interest-content-container">
                    {interest.map((data, key) => (
                      <div className="profile-interest-inner-content-container">
                        <input
                          id="interest"
                          name="interest"
                          type="checkbox"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={data}
                        />
                        <label htmlFor="interest">{data}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {formik.touched.gender && formik.errors.gender ? (
                  <div id="input-errors">{formik.errors.gender}</div>
                ) : null}
              </div>
              <div className="profile-right-content-container">
                <div className="profile-country-container">
                  <select
                    name="country"
                    id="country"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
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
                      <p>Email</p>
                      <div className="profile-email-header-icon-container">
                        {!isMail ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                      </div>
                    </div>
                    {!isMail && (
                      <div className="profile-email-content-container">
                        <div className="profile-email-scroll-container">
                          <div className="profile-email-input-container">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <div id="input-errors">{formik.errors.email}</div>
                            ) : null}
                          </div>

                          {addEmail.map((data, idx) => (
                            <div
                              key={idx}
                              className="profile-email-input-container"
                            >
                              <div className="profile-email-input-inner-container">
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="Enter your email"
                                  onBlur={formik.handleBlur}
                                  value={data.email}
                                  onChange={(e) =>
                                    setAddEmail(
                                      addEmail.map((elm, index) => {
                                        if (index == idx) {
                                          return {
                                            ...elm,
                                            email: e.target.value,
                                          };
                                        } else {
                                          return elm;
                                        }
                                      })
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
                              {formik.touched.email && formik.errors.email ? (
                                <div id="input-errors">
                                  {formik.errors.email}
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
                      <p>Phone</p>
                      <div className="profile-phone-header-icon-container">
                        {!isPhone ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                      </div>
                    </div>
                    {!isPhone && (
                      <div className="profile-phone-content-container">
                        <div className="profile-phone-scroll-container">
                          <div className="profile-phone-input-container">
                            <input
                              id="phone"
                              name="phone"
                              type="phone"
                              placeholder="Enter your phone"
                              onBlur={formik.handleBlur}
                              value={formik.values.phone}
                              onChange={handleChange}
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                              <div id="input-errors">{formik.errors.phone}</div>
                            ) : null}
                          </div>
                          {addPhone.map((data, idx) => (
                            <div
                              key={idx}
                              className="profile-phone-input-container"
                            >
                              <div className="profile-phone-input-inner-container">
                                <input
                                  id="phone"
                                  name="phone"
                                  type="phone"
                                  placeholder="Enter your phone"
                                  onBlur={formik.handleBlur}
                                  value={data.phone}
                                  onChange={(e) =>
                                    setAddPhone(
                                      addPhone.map((elm, index) => {
                                        if (index == idx) {
                                          return {
                                            ...elm,
                                            phone: e.target.value,
                                          };
                                        } else {
                                          return elm;
                                        }
                                      })
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
                              {formik.touched.phone && formik.errors.phone ? (
                                <div id="input-errors">
                                  {formik.errors.phone}
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
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Mobile */}
        <div className="profile-mob-container">
          <div className="profile-mob-header-container">
            <p>My Profile</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="profile-mob-img-container">
              <img src="" alt="" />
            </div>
            <div className="profile-mob-name-container">
              <div className="profile-mob-firstname-container">
                <label htmlFor="firstName">FirstName</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div id="input-errors">{formik.errors.firstName}</div>
                ) : null}
              </div>
              <div className="profile-mob-lastname-container">
                <label htmlFor="lastName">LastName</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div id="input-errors">{formik.errors.lastName}</div>
                ) : null}
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
