import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useState } from "react";
import { appUsers } from "../dummyusers/dummyData";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SitterProfilePage: React.FC = () => {
  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(false);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const user = appUsers.find((user) => user.id === parseInt(id!));

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center p-6">
          <img
            src={user.profile_picture_src}
            alt={`${user.firstname} ${user.lastname}`}
            className="h-48 w-48 rounded-full object-cover"
          />
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center">
            <button
              onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              {showEnquiryForm ? "Close" : "Make An Enquiry"}
            </button>
            {showEnquiryForm && (
              <div className="mt-6 w-full sm:w-auto">
                <EnquiryForm />
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
          <ul className="list-none space-y-2 text-left">
            <li>
              <strong>Location:</strong>{" "}
              {`${user.prefecture}, ${user.city_ward}`}
            </li>
            <li>
              <strong>Address:</strong> {user.street_address}
            </li>
            <li>
              <strong>Postal Code:</strong> {user.postal_code}
            </li>
            <li>
              <strong>Languages:</strong>{" "}
              {user.english_ok && user.japanese_ok
                ? "English, Japanese"
                : user.english_ok
                ? "English"
                : "Japanese"}
            </li>
            <li>
              <strong>Account Language:</strong> {user.account_language}
            </li>
          </ul>
        </div>

        {/* Timestamps */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <ul className="list-none space-y-2 text-left">
            <li>
              <strong>Account Created:</strong>{" "}
              {new Date(user.account_created).toLocaleString()}
            </li>
            <li>
              <strong>Last Login:</strong>{" "}
              {new Date(user.last_login).toLocaleString()}
            </li>
            <li>
              <strong>Last Updated:</strong>{" "}
              {new Date(user.last_updated).toLocaleString()}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          Back To Search Results
        </button>
      </div>
    </div>
  );
};

export default SitterProfilePage;
