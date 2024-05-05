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
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [upadteSuccess, setUpadteSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadingListing, setLoadingListing] = useState(false);

  const dispatch = useDispatch();

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
      setUpadteSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("api/v1/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure());
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure());
    }
  };

  const handleShowListings = async () => {
    setShowListingError(false);
    setLoadingListing(true);
    try {
      const res = await fetch(`/api/v1/user/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      } else {
        setLoadingListing(false);
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm("Are you sure you want to delete?");
      
      // If user confirms deletion
      if (confirmed) {
        const res = await fetch(`/api/v1/listing/delete/${listingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success === false) {
          console.log(data.message);
          return;
        }
  
        // Update user listings
        setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      }
    } catch (error) {
      console.log(error.message);
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
        <button
          disabled={loading}
          className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 "
        >
          {loading ? " Loading" : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className=" flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className=" text-red-700 cursor-pointer font-semibold"
        >
          Delete Acount
        </span>
        <span
          onClick={handleSignOut}
          className=" text-red-700 cursor-pointer font-semibold"
        >
          Sign Out
        </span>
      </div>
      <p className=" text-red-700 mt-5">{error ? error : ""}</p>
      <p className=" text-green-700 mt-5">
        {upadteSuccess ? "User is updated successfully" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full font-bold text-lg"
      >
        {loadingListing ? "Showing Listings..." : "Show Listings"}
      </button>
      <p className=" text-red-700 mt-5 text-sm">
        {showListingError ? " Something went wrong while showing lists" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className=" flex flex-col gap-4">
          <h1 className=" text-center text-2xl font-semibold"> Your Listing</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className=" border rounded-lg p-3 flex justify-between items-center gap-2"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt=" listing image cover"
                  className=" h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className=" text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className=" flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className=" text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className=" text-green-700 uppercase">Edit</button>
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
