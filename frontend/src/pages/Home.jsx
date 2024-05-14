import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  console.log(saleListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top section */}
      <div className=" flex flex-col gap-6 py-28 px-3 max-w-7xl mx-auto items-start ">
        <h1 className=" text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className=" text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className=" text-slate-400 text-xs  sm:text-sm">
          Grand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className=" text-blue-800 font-bold text-xs sm:text-sm hover:underline "
        >
          Let's get started...
        </Link>
      </div>
      {/* Swiper section */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[600px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* Listing result for offer, sale and rent */}
      <div className=" max-w-8xl mx-auto p-3 flex flex-col gap-8 my-10 items-center">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className=" my-3">
              <h2 className=" text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className=" text-sm text-blue-800 hover:underline"
              >
                Show More Offers
              </Link>
            </div>
            <div className=" flex gap-4 flex-wrap">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className=" my-3">
              <h2 className=" text-2xl font-semibold text-slate-600">
                Recent Place Fo Rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className=" text-sm text-blue-800 hover:underline"
              >
                Show More Places for Rent
              </Link>
            </div>
            <div className=" flex gap-4 flex-wrap">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className=" my-3">
              <h2 className=" text-2xl font-semibold text-slate-600">
                Recent Plcaes For Sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className=" text-sm text-blue-800 hover:underline"
              >
                Show More Places For Sale
              </Link>
            </div>
            <div className=" flex gap-4 flex-wrap">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
