import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateFailure,
  updateSuccess,
  updateUserStart,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [upadteSuccess, setUpadteSuccess] = useState(false);


  const dispatch = useDispatch();

  console.log(error, "err user");
  // console.log(filePerc, "filePerc");
  console.log(formData, "formData");
  // console.log(fileUploadError, "fileUploadError");

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error, "file upload error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }

      dispatch(updateSuccess(data));
      setUpadteSuccess(true)
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handlSubmit} className=" flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt=""
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className=" text-sm self-center">
          {fileUploadError ? (
            <span className=" text-red-700">
              File Upload error ( image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className=" text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className=" text-green-700">
              {" "}
              File Successfully Uploaded?
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className=" border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className=" border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className=" border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button disabled={loading} className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 ">
          {loading ?' Loading' : 'Update'}
        </button>
      </form>
      <div className=" flex justify-between mt-5">
        <span className=" text-red-700 cursor-pointer font-semibold">
          Delete Acount
        </span>
        <span className=" text-red-700 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
      <p className=" text-red-700 mt-5">{error ? error : ''}</p>
      <p className=" text-green-700 mt-5">{upadteSuccess ? "User is updated successfully" : ''}</p>
    </div>
  );
};

export default Profile;
